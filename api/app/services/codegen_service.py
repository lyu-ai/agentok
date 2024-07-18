from datetime import datetime
import json
import os
from typing import Any, Dict, List, Union

from jinja2 import Environment, FileSystemLoader, select_autoescape
from jinja2.ext import do

from .supabase_client import SupabaseClient

# Import models
from ..models import Project, Tool, User

# Set up the Jinja2 environment
env = Environment(
    loader=FileSystemLoader(searchpath=os.path.join(os.getcwd(), "app/", "templates")),
    autoescape=select_autoescape(),
    extensions=[do]
)

class CodegenService:
    def __init__(self, user: User, supabase_client: SupabaseClient):
        self.env = Environment(
            loader=FileSystemLoader(searchpath=os.path.join(os.getcwd(), "app/", "templates")),
            autoescape=select_autoescape(),
            extensions=[do]
        )
        self.user = user
        self.supabase_client = supabase_client  # Keep an instance of SupabaseClient

    def project2py(self, project: Project) -> str:
        flow = project.flow
        initializer_node = next((node for node in flow.nodes if node['type'] == 'initializer'), None)
        if not initializer_node:
            raise Exception('No initializer node found. This should be the first node in the flow.')

        # Find the first converser node, which is the only one downstream of the initializer
        first_converser = next((node for node in flow.nodes if any(
            edge['source'] == initializer_node['id'] and edge['target'] == node['id'] for edge in flow.edges
        )), None)

        if not first_converser:
            raise Exception('No converser node found. This should be the second node in the flow.')

        if first_converser['type'] not in {'conversable', 'user', 'assistant'}:
            raise Exception('The first converser node should be the conversable, user, or assistant node.')

        conversable_nodes = [node for node in flow.nodes if node['type'] == 'conversable']
        assistant_nodes = [node for node in flow.nodes if node['type'] == 'assistant']
        gpt_assistant_nodes = [node for node in flow.nodes if node['type'] == 'gpt_assistant']
        user_nodes = [node for node in flow.nodes if node['type'] == 'user']

        initial_chat_targets = [
            {
                'node': node,
                'chat_options': next((edge.get('data') for edge in flow.edges if edge['source'] == first_converser['id'] and edge['target'] == node['id']), None)
            }
            for node in flow.nodes if any(edge['source'] == first_converser['id'] and edge['target'] == node['id'] for edge in flow.edges)
        ]

        # Handle group chat nodes
        group_nodes = []
        for node in flow.nodes:
            if node['type'] == 'groupchat':
                group_nodes.append({'group_node': node, 'children': [n for n in flow.nodes if n.get('parentId') == node['id']]})
        print('group_nodes', group_nodes  )

        # Prepare nested chats data
        nested_chats = []
        for node in flow.nodes:
            if node['type'] == 'nestedchat':
                sender_nodes = [n for n in flow.nodes if any(edge['source'] == n['id'] and edge['target'] == node['id'] for edge in flow.edges)]

                # Check if there is exactly one upstream node
                if len(sender_nodes) != 1:
                    raise Exception(f'Nested chat node {node["id"]} must have exactly one upstream node, found {len(sender_nodes)}.')

                sender_node = sender_nodes[0]

                if not sender_node:
                    raise Exception(f'Nested chat node {node["id"]} must have exactly one upstream sender node.')

                recipient_nodes_with_options = [
                    {
                        'node': recipient_node,
                        'chat_options': next((edge['data'] for edge in flow.edges if edge['source'] == node['id'] and edge['target'] == recipient_node['id']), {})
                    }
                    for recipient_node in flow.nodes if any(edge['source'] == node['id'] and edge['target'] == recipient_node['id'] for edge in flow.edges)
                ]

                nested_chats.append({
                    'nested_chat_node': node,
                    'sender': sender_node,
                    'recipients': recipient_nodes_with_options
                })

        note_nodes = [node for node in flow.nodes if node['type'] == 'note']

        settings = self.supabase_client.get_settings(self.user)
        for model in settings.get('models', []):
            if 'id' in model:
                del model['id']
            if 'description' in model:
                del model['description']
        # Use the template for each node
        template = self.env.get_template("main.j2")  # Main template

        code = template.render(project=project,
                               user=self.user,
                               settings=settings, # Account level settings include models, etc.
                               nodes=flow.nodes,
                               first_converser=first_converser,
                               initial_chat_targets=initial_chat_targets,
                               conversable_nodes=conversable_nodes,
                               assistant_nodes=assistant_nodes,
                               gpt_assistant_nodes=gpt_assistant_nodes,
                               user_nodes=user_nodes,
                               group_nodes=group_nodes,
                               nested_chats=nested_chats,
                               generation_date=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                               note_nodes=note_nodes,
                               tools=project.tools,)

        return code

    def tool2py(self, tool: Tool) -> json:
        """Generate code based on the provided function meta information.

        Args:
            tool (Tool): Tool meta, such as name, description, parameters etc.

        Returns:
            json: Generated function code in JSON format.
        """
        import openai
        from openai import OpenAI

        client = OpenAI()
        client.api_key = os.environ['OPENAI_API_KEY']

        # Create the prompt with detailed parameter information
        prompt = "Create a Python function as one text string based on the following information, provide the result in JSON format {name, description, code}"
        prompt += f"the 'code' field should only include the function body and should not include the function name and parameters \n\n"
        prompt += f"Function Name: {tool.name}\n"
        prompt += f"Description: {tool.description}\n"
        prompt += f"Parameters:\n"

        for param in tool.parameters:
            prompt += f"- {param.name} ({param.type}): {param.description}\n"

        prompt += "\nPython Function:\n"

        # Now call the OpenAI API with this prompt
        try:
            response = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                response_format={"type": "json_object"},
                model="gpt-4o",
            )

            # Print the generated code
            generated_code = response.choices[0].message.content
            print(generated_code)

            return json.loads(generated_code)
        except openai.APIStatusError as e:
            print(f"Error: {e}")

# Example usage
if __name__ == '__main__':
    service = CodegenService()

    tool_data = {
        'name': 'run_python',
        'description': 'run the provided python code with ipython',
        'parameters': [
            {
                'name': 'code',
                'description': 'the python code to be run',
                'type': 'string',
            }
        ],
    }

    generated_code = service.tool2py(tool_data)
    print(generated_code)