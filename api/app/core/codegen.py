from datetime import datetime
import json
import os
from jinja2 import Environment, FileSystemLoader, select_autoescape
from jinja2.ext import do
from typing import Any, Dict, List, Union

from ..schemas import Autoflow, Function

# Set up the Jinja2 environment
env = Environment(
    loader=FileSystemLoader(searchpath=os.path.join(os.getcwd(), "app/", "templates")),
    autoescape=select_autoescape(),
    extensions=[do]
)

def flow2py(flow: Autoflow) -> str:
  flow = flow.flow
  assistant_nodes = [node for node in flow.nodes if node['type'] == 'assistant']
  custom_conversable_nodes = [node for node in flow.nodes if node['type'] == 'custom_conversable']
  # TODO: It's possible there are multiple user_proxy nodes
  # Now we assumed there is only one user_proxy node has no incoming edges
  user_proxy = next(
      (node for node in flow.nodes
      if node['type'] == 'user' and
      not any(edge['source'] == node['id'] for edge in flow.edges)),
      None
  )
  if not user_proxy:
    raise Exception('No user proxy node found')
  first_converser = next(
      (node for node in flow.nodes
      if any(edge['source'] == node['id'] and
              edge['target'] == user_proxy['id'] for edge in flow.edges)),
      None
  )
  config_node = next((node for node in flow.nodes if node['type'] == 'config'), None)
  functions = config_node['data'].get('functions', [])
  group_chat_node = next((node for node in flow.nodes if node['type'] == 'groupchat'), None)
  grouped_nodes = []
  if group_chat_node:
    grouped_nodes = [node for node in flow.nodes if any(
      edge['source'] == node['id'] and edge['target'] == group_chat_node['id'] for edge in flow.edges
    )]
  note_nodes = [node for node in flow.nodes if node['type'] == 'note']

  # Use the template for each node
  template = env.get_template("base.j2") # Main template

  code = template.render(nodes=flow.nodes,
                        assistant_nodes=assistant_nodes,
                        custom_conversable_nodes=custom_conversable_nodes,
                        config_node=config_node,
                        generation_date=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        note_nodes=note_nodes,
                        functions=functions,
                        main_user_proxy=user_proxy,
                        first_converser=first_converser,
                        group_chat_node=group_chat_node,
                        grouped_nodes=grouped_nodes,)

  return code


import openai
from openai import OpenAI

def func2py(func: Function) -> json:
  """Generate code based on the provided function meta information.

  Args:
      func (Function): Function meta, such as name, description, parameters etc.

  Returns:
      json: Generated function code in JSON format.
  """

  client = OpenAI()
  client.api_key = os.environ['OPENAI_API_KEY']

  # Create the prompt with detailed parameter information
  prompt = "Create a Python function as one text string based on the following information, provide the result in JSON format \{name, description, code\}"
  prompt += f"the 'code' field should only include the function body and should not include the function name and parameters \n\n"
  prompt += f"Function Name: {func.name}\n"
  prompt += f"Description: {func.description}\n"
  prompt += f"Parameters:\n"

  for param in func.parameters:
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
          response_format={ "type": "json_object" },
          model="gpt-4-1106-preview",
      )

      # Print the generated code
      generated_code = response.choices[0].message.content
      return json.loads(generated_code)
  except openai.APIStatusError as e:
      print(f"Error: {e}")

if __name__ == '__main__':
  func = {
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

  generated_code = func2py(func)

