# This file is generated with Agentok Studio.
# Last generated: 2025-01-10 21:58:16
#
# Project Name: Sequential Chat
# Author: Unknown (hi@agentok.ai)
# Last Updated: 2025-01-10T12:55:56.49+00:00
# Description:
"""
A sample flow that talks to multiple assistant, which is named Sequential Chats.
"""



from dotenv import load_dotenv, dotenv_values
load_dotenv()  # This will load all environment variables from .env

import argparse
import os
import time
from termcolor import colored
from typing import Annotated

# Parse command line arguments
parser = argparse.ArgumentParser(description='Start a chat with agents.')
parser.add_argument('message', type=str, help='The message to send to agent.')
args = parser.parse_args()

import autogen

# openai, whisper are optional dependencies
# However, we beleive they are useful for other future examples, so we include them here as part of standard imports
from openai import OpenAI
from autogen import AssistantAgent
from autogen import UserProxyAgent

# Replace the default get_human_input function for status control
def custom_get_human_input(self, prompt: str) -> str:
    # Set wait_for_human_input to True
    print('__STATUS_WAIT_FOR_HUMAN_INPUT__', prompt, flush=True)
    reply = input(prompt)
    # Restore the status to running
    print('__STATUS_RECEIVED_HUMAN_INPUT__', prompt, flush=True)
    return reply

autogen.ConversableAgent.get_human_input = custom_get_human_input

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

config_list = autogen.config_list_from_json(
    env_or_file="OAI_CONFIG_LIST",
)

llm_config = {
    "config_list": config_list,
}

import tempfile
temp_dir = tempfile.gettempdir()

# Conversable Agents


# Assistant Agents
node_assistant_aycOo1y7 = AssistantAgent(
    name="Adder",
    system_message="""You add 1 to each number I give you and return me the new numbers, one number each line.""",
    human_input_mode="NEVER",
    llm_config=llm_config,
)
node_assistant_WOaXJRCW = AssistantAgent(
    name="Multiplier",
    system_message="""You multiply each number I give you by 2 and return me the new numbers, one number each line.""",
    human_input_mode="NEVER",
    llm_config=llm_config,
)
node_assistant_UZj4G_LO = AssistantAgent(
    name="Divider",
    system_message="""You divide each number I give you by 2 and return me the new numbers, one number each line.""",
    human_input_mode="NEVER",
    llm_config=llm_config,
)
node_assistant_Vk4rDF6b = AssistantAgent(
    name="Subtractor",
    system_message="""You subtract 1 from each number I give you and return me the new numbers, one number each line.""",
    human_input_mode="NEVER",
    llm_config=llm_config,
)
node_user_7j_1RHfz = UserProxyAgent(
    name="Number",
    system_message="""You return me the numbers I give you, one number each line.""",
    human_input_mode="NEVER",
    code_execution_config={ # Make code excution always available for user_proxy nodes
        "executor": autogen.coding.LocalCommandLineCodeExecutor(
            work_dir=os.path.join(temp_dir, "user_code"),
        )
    },
)
# Group Chats
# Nested Chats
# Tools
# Start the conversation


# Sequential Chats
chat_results = node_user_7j_1RHfz.initiate_chats(
    [
      {
        "recipient": node_assistant_aycOo1y7,
        "message": args.message,
        "max_turns": 2,
        "summary_method": "last_msg",
      },
      {
        "recipient": node_assistant_WOaXJRCW,
        "message": "These are my numbers.",
        "max_turns": 2,
        "summary_method": "last_msg",
      },
      {
        "recipient": node_assistant_UZj4G_LO,
        "message": "These are my numbers.",
        "max_turns": 2,
        "summary_method": "last_msg",
      },
      {
        "recipient": node_assistant_Vk4rDF6b,
        "message": "These are my numbers.",
        "max_turns": 2,
        "summary_method": "last_msg",
      }
    ]
)

# Output the sequential chat results
import json
print("__CHAT_RESULTS__", json.dumps([{
    "chat_id": result.chat_id,
    "chat_history": result.chat_history,
    "summary": result.summary,
    "cost": result.cost,
    "human_input": result.human_input
} for result in chat_results]))