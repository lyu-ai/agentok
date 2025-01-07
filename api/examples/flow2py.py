# This file is generated with Agentok Studio.
# Last generated: 2025-01-07 09:57:34
#
# Project Name: Awesome Project
# Author: Unknown (hi@agentok.ai)
# Last Updated: 2025-01-05T05:06:32.939037+00:00
# Description:
"""
A new project with sample flow.
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

# autogen.ConversableAgent.get_human_input = custom_get_human_input

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

node_assistant_q2FNbPZN = AssistantAgent(
    name="Assistant",
    llm_config=llm_config,
)
node_user_UTIV5vKy = UserProxyAgent(
    name="User",
    code_execution_config={ # Make code excution always available for user_proxy nodes
        "last_n_messages": 2,
        "work_dir": os.path.join(temp_dir, "user_code"),
        "use_docker": False,
    },
    llm_config=llm_config,
)
# Group Chats
# Nested Chats
# Tools
# Start the conversation

# Talk to one single agent
chat_result = node_user_UTIV5vKy.initiate_chat(
    node_assistant_q2FNbPZN,
    message=args.message,
)