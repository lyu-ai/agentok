import os
import autogen
from autogen import AssistantAgent, UserProxyAgent

config_list = autogen.config_list_from_json(
    env_or_file="OAI_CONFIG_LIST",
)

llm_config = {
    "config_list": config_list,
}

assistant = AssistantAgent("assistant", llm_config=llm_config)

user_proxy = UserProxyAgent(
    "user_proxy", code_execution_config={"executor": autogen.coding.LocalCommandLineCodeExecutor(work_dir="coding")}
)

# Start the chat
user_proxy.initiate_chat(
    assistant,
    message="Plot a chart of NVDA and TESLA stock price change YTD.",
)
