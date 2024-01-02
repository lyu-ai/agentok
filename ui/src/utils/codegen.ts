export enum AgentTypes {
  user_proxy = 'UserProxyAgent',
  assistant = 'AssistantAgent',
  gpt_assistant = 'GPTAssistantAgent',
  image_agent = 'MultimodalConversableAgent',
  chat = 'Chat',
}

const genAssistantAgent = (node: any) => {
  const name = node.data.name;
  const instructions = node.data.instructions
    ? `"${node.data.instructions}"`
    : 'AssistantAgent.DEFAULT_SYSTEM_MESSAGE';
  return `
node_${node.id} = ${node.data.class}(
  name="${name}",
  llm_config=llm_config,
)
`;
};

const genConversableAgent = (node: any) => {
  const name = node.data.name;
  return `
node_${node.id} = ${node.data.class}(
  name="${name}",
  max_consecutive_auto_reply=${node.data.max_consecutive_auto_reply},
  llm_config=${
    node.data.class === 'MultimodalConversableAgent'
      ? 'llm_config_4v'
      : 'llm_config'
  },
)
`;
};

const genUserProxyAgent = (node: any) => {
  const name = node.data.name;
  return `
node_${node.id} = ${node.data.class}(
  name="${name}",
  code_execution_config={
    "work_dir": "coding"
  },
  is_termination_msg=lambda msg: "TERMINATE" in msg["content"],
  human_input_mode="${node.data.human_input_mode}",
  system_message="${node.data.system_message}",
  max_consecutive_auto_reply=${node.data.max_consecutive_auto_reply},
)\n
`;
};

const codegenDict: Record<string, (node: any) => string> = {
  UserProxyAgent: genUserProxyAgent,
  AssistantAgent: genAssistantAgent,
  GPTAssistantAgent: genAssistantAgent,
  MultimodalConversableAgent: genConversableAgent,
};

const importDict: Record<string, string> = {
  UserProxyAgent: 'from autogen import UserProxyAgent',
  AssistantAgent: 'from autogen import AssistantAgent',
  GPTAssistantAgent:
    'from autogen.agentchat.contrib.gpt_assistant_agent import GPTAssistantAgent',
  MultimodalConversableAgent:
    'from autogen.agentchat.contrib.multimodal_conversable_agent import MultimodalConversableAgent',
};

export const genEntry = (
  data: { nodes: any[]; edges: any[] },
  message: string
) => {
  const { nodes, edges } = data;
  if (!nodes || nodes.length === 0 || !edges || edges.length === 0) {
    throw new Error('No nodes found or not connected');
  }
  // Locate the chat node to start the code generation
  const userProxy = nodes.find((node: any) => node.type === 'user');
  if (!userProxy) {
    throw new Error('chat node not found');
  }
  // Chat should be connected to an UserProxyAgent and at least one AssistantAgent to start conversation
  const chatEdges = edges.filter((edge: any) => edge.target === userProxy.id);
  const upsteamNodes = nodes.filter(node =>
    chatEdges.find(edge => edge.source === node.id)
  );

  if (!upsteamNodes || upsteamNodes.length === 0) {
    throw new Error('No upstream agents found');
  }

  let code = `import autogen\n\nprint(autogen.__version__)\n\n`;

  const uniqueImports = new Set<string>();
  uniqueImports.add(importDict['AssistantAgent']); // Always import AssistantAgent
  for (const node of nodes) {
    const importLine = importDict[node.data.class];
    if (importLine) {
      uniqueImports.add(importLine);
    } else {
      console.warn(`No import found for name '${node.data.name}'`);
    }
  }

  code += Array.from(uniqueImports).join('\n') + '\n\n';

  code += `
# The default config list in notebook.
config_list = autogen.config_list_from_json(
    "OAI_CONFIG_LIST",
    filter_dict={
        "model": ["gpt-4", "gpt-4-1106-preview", "gpt-4-vision-preview"],
    },
)

config_list_4v = autogen.config_list_from_json(
    "OAI_CONFIG_LIST",
    filter_dict={
        "model": ["gpt-4-vision-preview"],
    },
)

`;

  code += `llm_config = {"config_list": config_list, "cache_seed": 42}\n\n`;
  code += `llm_config_4v = {"config_list": config_list_4v, "temperature": 0.5, "max_tokens": 1024}\n\n`;

  for (const node of nodes) {
    code += codegenDict[node.data.class](node);
  }

  code += `
# Ask the question with an image
node_${userProxy.id}.initiate_chat(node_${upsteamNodes[0].id},
                         message="""${message}""")
  `;

  return code;
};
