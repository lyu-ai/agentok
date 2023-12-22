from datetime import datetime
import json
import os
from jinja2 import Environment, FileSystemLoader, select_autoescape
from jinja2.ext import do
from typing import Any, Dict, List, Union

from ..schemas import Flow

print('target path:', os.path.join(os.getcwd(), "app/", "templates"))
# Set up the Jinja2 environment
env = Environment(
    loader=FileSystemLoader(searchpath=os.path.join(os.getcwd(), "app/", "templates")),
    autoescape=select_autoescape(),
    extensions=[do]
)

def flow2py(flow: Flow) -> str:
  flow = flow.flow
  assistant_nodes = [node for node in flow.nodes if node['type'] == 'assistant']
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
                        config_node=config_node,
                        generation_date=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        note_nodes=note_nodes,
                        functions=functions,
                        main_user_proxy=user_proxy,
                        first_converser=first_converser,
                        group_chat_node=group_chat_node,
                        grouped_nodes=grouped_nodes,)

  return code


if __name__ == '__main__':
  flow_name = 'gptassistant'
  data_dir = './data/'
  generated_dir = './generated/'

  data_path = os.path.join(data_dir, f'{flow_name}.json')
  with open(data_path, 'r', encoding='utf-8') as file:
      flow = json.load(file)

  generated_code = flow2py(flow)
  print(generated_code)

  # Save the generated code to the output file
  if not os.path.exists(generated_dir):
      os.makedirs(generated_dir)
  code_path = os.path.join(generated_dir, f'{flow_name}.py')
  with open(code_path, 'w', encoding='utf-8') as file:
    file.write(generated_code)
    print('Generated code saved to', code_path)
