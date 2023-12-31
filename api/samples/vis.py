
import autogen
import argparse
from termcolor import colored

from autogen.agentchat.contrib.multimodal_conversable_agent import MultimodalConversableAgent
from autogen import UserProxyAgent


config_list = autogen.config_list_from_json(
    "OAI_CONFIG_LIST",
    filter_dict={
        "model": ["gpt-4-1106-preview", "gpt-4-vision-preview"],
    },
)

llm_config = {
    "config_list": config_list,
}

node_1 = MultimodalConversableAgent(
    name="Image",
    llm_config=llm_config,
)

user_proxy = UserProxyAgent(
    name="UserProxy",
    human_input_mode="""NEVER""",
    is_termination_msg=lambda x: x.get("content", "") and x.get("content", "").rstrip().endswith("TERMINATE"),
)
# Function template content generator
# register the functions
user_proxy.register_function(
    function_map={
    }
)# Parse command line arguments
parser = argparse.ArgumentParser(description='Start a chat with agents.')
parser.add_argument('message', type=str, help='The message to send to agent.')
args = parser.parse_args()

# Ask the question with an image

# start the conversation
user_proxy.initiate_chat(
    node_1,
    message=args.message,
)
