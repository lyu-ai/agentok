from datetime import datetime
import ast
import json
import os
import re
import textwrap
from jinja2 import Environment, FileSystemLoader, select_autoescape
from jinja2.ext import do
from .supabase import SupabaseClient, create_supabase_client
from ..models import Project, Tool
from openai import OpenAI, APIStatusError


class CodegenService:
    def __init__(self, supabase: SupabaseClient):
        self.env = Environment(
            loader=FileSystemLoader(
                searchpath=os.path.join(os.getcwd(), "agentok_api/", "templates")
            ),
            autoescape=select_autoescape(),
            extensions=[do],
        )
        self.supabase = supabase  # Keep an instance of SupabaseClient

    def project2py(self, project: Project) -> str:
        flow = project.flow
        initializer_node = next(
            (node for node in flow.nodes if node["type"] == "initializer"), None
        )
        if not initializer_node:
            raise Exception(
                "No initializer node found. This should be the first node in the flow."
            )

        # Find the first converser node, which is the only one downstream of the initializer
        first_converser = next(
            (
                node
                for node in flow.nodes
                if any(
                    edge["source"] == initializer_node["id"]
                    and edge["target"] == node["id"]
                    for edge in flow.edges
                )
            ),
            None,
        )

        if not first_converser:
            raise Exception(
                "No converser node found. This should be the second node in the flow."
            )

        if first_converser["type"] not in {"conversable", "user", "assistant"}:
            raise Exception(
                "The first converser node should be the conversable, user, or assistant node."
            )

        conversable_nodes = [
            node for node in flow.nodes if node["type"] == "conversable"
        ]
        assistant_nodes = [node for node in flow.nodes if node["type"] == "assistant"]
        gpt_assistant_nodes = [
            node for node in flow.nodes if node["type"] == "gpt_assistant"
        ]
        user_nodes = [node for node in flow.nodes if node["type"] == "user"]

        initial_chat_targets = [
            {
                "node": node,
                "chat_options": next(
                    (
                        edge.get("data")
                        for edge in flow.edges
                        if edge["source"] == first_converser["id"]
                        and edge["target"] == node["id"]
                    ),
                    None,
                ),
            }
            for node in flow.nodes
            if any(
                edge["source"] == first_converser["id"] and edge["target"] == node["id"]
                for edge in flow.edges
            )
        ]

        # Handle group chat nodes
        group_nodes = []
        for node in flow.nodes:
            if node["type"] == "groupchat":
                group_nodes.append(
                    {
                        "group_node": node,
                        "children": [
                            n for n in flow.nodes if n.get("parentId") == node["id"]
                        ],
                    }
                )
        print("group_nodes", group_nodes)

        # Prepare nested chats data
        nested_chats = []
        for node in flow.nodes:
            if node["type"] == "nestedchat":
                sender_nodes = [
                    n
                    for n in flow.nodes
                    if any(
                        edge["source"] == n["id"] and edge["target"] == node["id"]
                        for edge in flow.edges
                    )
                ]

                # Check if there is exactly one upstream node
                if len(sender_nodes) != 1:
                    raise Exception(
                        f'Nested chat node {node["id"]} must have exactly one upstream node, found {len(sender_nodes)}.'
                    )

                sender_node = sender_nodes[0]

                if not sender_node:
                    raise Exception(
                        f'Nested chat node {node["id"]} must have exactly one upstream sender node.'
                    )

                recipient_nodes_with_options = [
                    {
                        "node": recipient_node,
                        "chat_options": next(
                            (
                                edge["data"]
                                for edge in flow.edges
                                if edge["source"] == node["id"]
                                and edge["target"] == recipient_node["id"]
                            ),
                            {},
                        ),
                    }
                    for recipient_node in flow.nodes
                    if any(
                        edge["source"] == node["id"]
                        and edge["target"] == recipient_node["id"]
                        for edge in flow.edges
                    )
                ]

                nested_chats.append(
                    {
                        "nested_chat_node": node,
                        "sender": sender_node,
                        "recipients": recipient_nodes_with_options,
                    }
                )

        note_nodes = [node for node in flow.nodes if node["type"] == "note"]

        settings = self.supabase.fetch_settings()
        for model in settings.get("models", []):
            if "id" in model:
                del model["id"]
            if "description" in model:
                del model["description"]
        # Use the template for each node
        template = self.env.get_template("main.j2")  # Main template

        # Generate tool assignments
        tools = self.supabase.fetch_tools()
        tool_assignments = self.generate_tool_assignments(flow.nodes, tools)

        code = template.render(
            project=project,
            user=self.supabase.get_user(),
            settings=settings,  # Account level settings include models, etc.
            nodes=flow.nodes,
            first_converser=first_converser,
            initial_chat_targets=initial_chat_targets,
            conversable_nodes=conversable_nodes,
            assistant_nodes=assistant_nodes,
            gpt_assistant_nodes=gpt_assistant_nodes,
            user_nodes=user_nodes,
            group_nodes=group_nodes,
            nested_chats=nested_chats,
            generation_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            note_nodes=note_nodes,
            tools=tools,
            tool_assignments=tool_assignments,
        )

        return code

    def generate_tool_assignments(self, nodes, tools):
        # Prepare the tool assignments
        tool_assignments = {"llm": [], "execution": []}

        # Create a dictionary for quick lookup of tools by their ID
        tool_dict = {tool["id"]: tool for tool in tools}

        for node in nodes:
            if node["data"].get("tools") is not None:
                # Iterate over node.data.tools.llm and append to llm_tools
                for tool_id in node["data"]["tools"].get("llm", []):
                    if tool_id in tool_dict:
                        tool_assignments["llm"].append(
                            {
                                "node": node["id"],
                                "tool": tool_dict[tool_id]["name"],
                                "description": tool_dict[tool_id]["description"],
                            }
                        )

                # Iterate over node.data.tools.execution and append to execution_tools
                for tool_id in node["data"]["tools"].get("execution", []):
                    if tool_id in tool_dict:
                        tool_assignments["execution"].append(
                            {"node": node["id"], "tool": tool_dict[tool_id]["name"]}
                        )

        # Now tool_assignments contains the desired structure
        print(tool_assignments)
        return tool_assignments

    def tool2py(self, tool: Tool):
        """Generate code based on the provided function meta information.

        Args:
            tool (Tool): Tool meta, such as name, description, parameters etc.

        Returns:
            json: Generated function code in JSON format.
        """
        client = OpenAI()
        client.api_key = os.environ["OPENAI_API_KEY"]

        # Create the prompt with detailed parameter information
        prompt = "Create a Python function as one text string based on the following information, provide the result in JSON format {name, description, code}.\n"
        prompt += f"Function Name: {tool.name}\n"
        prompt += f"Description: {tool.description}\n"
        prompt += "Parameters:\n"

        for signature in tool.signatures:
            prompt += (
                f"- {signature.name} ({signature.type}): {signature.description}\n"
            )

        prompt += "\nPython Function:\n"
        prompt += "The function should include the name, description, and parameters as annotations.\n"

        # Now call the OpenAI API with this prompt
        try:
            response = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant designed to output JSON.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                response_format={"type": "json_object"},
                model="gpt-4o",
            )

            # Print the generated code
            generated_code = response.choices[0].message.content
            if not generated_code:
                raise Exception("No code generated")
            print(generated_code)

            return json.loads(generated_code)
        except APIStatusError as e:
            print(f"Error: {e}")
            raise

    def extract_tool_meta(self, code: str):
        """
        Extract meta information from the provided Python function code.

        Args:
            code (str): The Python function code as a string.

        Returns:
            dict: Meta information as a dictionary.
        """
        # Parse the code into an AST
        tree = ast.parse(code)

        # Find the function definition in the AST
        func_def = next(
            (node for node in tree.body if isinstance(node, ast.FunctionDef)), None
        )
        if not func_def:
            raise ValueError("No function definition found in the provided code")

        # Extract function name
        func_name = func_def.name

        # Extract docstring
        docstring = ast.get_docstring(func_def)
        description = ""
        param_descriptions = {}

        if docstring:
            docstring_lines = docstring.split("\n")
            description = docstring_lines[0].strip()
            if len(docstring_lines) > 1:
                param_lines = [
                    line.strip() for line in docstring_lines[1:] if line.strip()
                ]
                for line in param_lines:
                    match = re.match(r"(\w+) \((\w+)\): (.+)", line)
                    if match:
                        param_name, param_type, param_desc = match.groups()
                        param_descriptions[param_name] = {
                            "type": param_type,
                            "description": param_desc,
                        }

        # Extract parameters
        parameters = []
        for arg in func_def.args.args:
            param_name = arg.arg
            param_type = None
            if arg.annotation:
                param_type = ast.unparse(arg.annotation)
            param_desc = param_descriptions.get(param_name, {}).get("description", "")
            parameters.append(
                {"name": param_name, "type": param_type, "description": param_desc}
            )

        # Extract variables from the function body
        variables = []
        for node in ast.walk(func_def):
            if isinstance(node, ast.Str) and "{{" in node.s and "}}" in node.s:
                vars_in_node = re.findall(r"\{\{(.*?)\}\}", node.s)
                for var in vars_in_node:
                    variables.append({"name": var})

        # Create the meta information dictionary
        meta_info = {
            "name": func_name,
            "description": description,
            "signatures": parameters,
            "variables": variables,
        }

        return meta_info


# Example usage
# Run from the project root directory
# poetry run python3 -m agentok_api.services.codegen
if __name__ == "__main__":
    supabase = create_supabase_client()
    service = CodegenService(supabase)

    # tool_data = Tool(
    #     id=1,
    #     name='run_python',
    #     description='run the provided python code with ipython',
    #     signatures=[
    #         ToolSignature(
    #             id=1,
    #             name='code',
    #             description='the python code to be run',
    #             type='str',
    #         ),
    #     ],
    # )

    # generated_code = service.tool2py(tool_data)
    # print(generated_code)
    # Example usage
    code = textwrap.dedent("""
    def hello(message: str) -> None:
        '''Send hello world message.
        Parameters:
        message (str): The message to be printed.
        '''
        print(message + '{{VAR1}}' + '{{VAR2}}')
    """)

    meta_info = service.extract_tool_meta(code)
    print(json.dumps(meta_info, indent=2))
