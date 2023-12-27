# Concepts

This article introduces the concepts of AutoGen and FlowGen. Part of the content is from the [AutoGen documentation](https://microsoft.github.io/autogen/) just for convenience.

Please read the paper for a big picture: [AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation Framework](https://arxiv.org/pdf/2308.08155.pdf). Qingyun Wu, Gagan Bansal, Jieyu Zhang, Yiran Wu, Shaokun Zhang, Erkang Zhu, Beibin Li, Li Jiang, Xiaoyun Zhang and Chi Wang. ArXiv 2023.

## AutoGen and FlowGen

AutoGen offers a unified multi-agent conversation framework as a high-level abstraction of using foundation models. It features capable, customizable and conversable agents which integrate LLMs, tools, and humans via automated agent chat. By automating chat among multiple capable agents, one can easily make them collectively perform tasks autonomously or with human feedback, including tasks that require using tools via code.

This framework simplifies the orchestration, automation and optimization of a complex LLM workflow. It maximizes the performance of LLM models and overcome their weaknesses. It enables building next-gen LLM applications based on multi-agent conversations with minimal effort.

FlowGen is a tool built for AutoGen, a great agent framework from Microsoft Research.

## Type of Agent

This diagram shows the basic concepts of AutoGen, which were inherited in FlowGen.

![Alt text](https://microsoft.github.io/autogen/assets/images/autogen_agents-b80434bcb15d46da0c6cbeed28115f38.png)

There are three types of agents in AutoGen:

- **Assistant Agent**: The AssistantAgent is designed to act as an AI assistant, using LLMs by default but not requiring human input or code execution. It could write Python code (in a Python coding block) for a user to execute when a message (typically a description of a task that needs to be solved) is received. Under the hood, the Python code is written by LLM (e.g., GPT-4). It can also receive the execution results and suggest corrections or bug fixes. Its behavior can be altered by passing a new system message. The LLM inference configuration can be configured via `llm_config`.

- **UserProxy Agent**: The UserProxyAgent is conceptually a proxy agent for humans, soliciting human input as the agent's reply at each interaction turn by default and also having the capability to execute code and call functions. The UserProxyAgent triggers code execution automatically when it detects an executable code block in the received message and no human user input is provided. Code execution can be disabled by setting the code_execution_config parameter to False. LLM-based response is disabled by default. It can be enabled by setting llm_config to a dict corresponding to the inference configuration. When llm_config is set as a dictionary, UserProxyAgent can generate replies using an LLM when code execution is not performed.

- **GroupChat Manager**: An optimizable agent is an agent that can be optimized. It can be a human, a tool, or an LLM. It can be a single agent or a group of agents. It can be a single-turn agent or a multi-turn agent. It can be a single-role agent or a multi-role agent.
