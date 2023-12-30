# This file is generated automatically by [AutoGen](https://github.com/tiwater/autogen)
# Changes to this file might be overwritten.
# Last generated: 2023-12-21 00:08:20
#
# Autoflow Name: Feedback from Code Execution
# Description: Auto Feedback from Code Execution.
#
"""
```
What date is today? Compare the year-to-date gain for META and TESLA.
```

# Auto Generated Agent Chat: Task Solving with Code Generation, Execution & Debugging

AutoGen offers conversable LLM agents, which can be used to solve various tasks with human or automatic feedback, including tasks that require using tools via code.
Please find documentation about this feature [here](https://microsoft.github.io/autogen/docs/Use-Cases/agent_chat).

In this notebook, we demonstrate how to use `AssistantAgent` and `UserProxyAgent` to write code and execute the code. Here `AssistantAgent` is an LLM-based agent that can write Python code (in a Python coding block) for a user to execute for a given task. `UserProxyAgent` is an agent which serves as a proxy for the human user to execute the code written by `AssistantAgent`, or automatically execute the code. Depending on the setting of `human_input_mode` and `max_consecutive_auto_reply`, the `UserProxyAgent` either solicits feedback from the human user or returns auto-feedback based on the result of code execution (success or failure and corresponding outputs) to `AssistantAgent`. `AssistantAgent` will debug the code and suggest new code if the result contains error. The two agents keep communicating to each other until the task is done.
"""
import autogen
import argparse
from termcolor import colored

from autogen import AssistantAgent
from autogen import UserProxyAgent


config_list = autogen.config_list_from_json(
    "OAI_CONFIG_LIST",
    filter_dict={
        "model": ["gpt-4-1106-preview", "gpt-4-vision-preview"],
    },
)

llm_config = {
    "functions": [
        {
            "name": "hello",
            "description": "Print hello world message.",
            "parameters": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "The message to be printed."
                    }
                },
                "required": [
                ]
            },
        }
    ],
    "config_list": config_list,
    "temperature": 0,
    "max_tokens": 1024,
}

node_rgbq79ak39o = AssistantAgent(
    name="Assistant",
    llm_config=llm_config,
)

user_proxy = UserProxyAgent(
    name="UserProxy",
    human_input_mode="NEVER",
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    max_consecutive_auto_reply=10,
)
# Function template content generator

def __func_hello(message):
    pass
# register the functions
user_proxy.register_function(
    function_map={
      "hello": __func_hello,
    }
)# Parse command line arguments
parser = argparse.ArgumentParser(description='Start a chat with agents.')
parser.add_argument('message', type=str, help='The message to send to agent.')
args = parser.parse_args()

# Ask the question with an image

# start the conversation
user_proxy.initiate_chat(
    node_rgbq79ak39o,
    message=args.message,
)