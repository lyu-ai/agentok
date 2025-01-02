import { AssistantNode } from '@/components/flow/node/assistant';
import { UserProxyAgent } from '@/components/flow/node/user';
import { GroupChatManager } from '@/components/flow/node/group-chat';
import { NoteNode } from '@/components/flow/node/note';

import { Node, ReactFlowInstance } from 'reactflow';
import { genId } from '@/lib/id';
import { ConversableAgent } from '@/components/flow/node/conversable-agent';
import { InitializerNode } from '@/components/flow/node/initializer';
import { ConverseEdge } from '@/components/flow/edge/converse-edge';
import { NestedChat } from '@/components/flow/node/nested-chat';
import { GPTAssistantNode } from '@/components/flow/node/gpt-assistant';
import { RetrieveUserProxyAgent } from '@/components/flow/node/retrieve-user';
import { RetrieveAssistantNode } from '@/components/flow/node/retrieve-assistant';
// Import icons from the new icons file
import { Icons, Icon } from '@/components/icons';

export const nodeTypes = {
  initializer: InitializerNode,
  assistant: AssistantNode,
  user: UserProxyAgent,
  groupchat: GroupChatManager, // DO NOT change the type to 'group', as it's a builtin type of react-flow
  note: NoteNode,
  conversable: ConversableAgent,
  nestedchat: NestedChat,
  gpt_assistant: GPTAssistantNode,
  retrieve_user: RetrieveUserProxyAgent,
  retrieve_assistant: RetrieveAssistantNode,
};

export const edgeTypes = {
  converse: ConverseEdge,
};

export const isConversable = (node?: Node) =>
  node?.type &&
  [
    'assistant',
    'user',
    'conversable',
    'groupchat',
    'nestedchat',
    'gpt_assistant',
    'retrieve_assistant',
    'retrieve_user',
  ].includes(node.type);

// Fields of Node Meta:
// - name: To be used as variable name in generated code
// - label: Shown on UI, the value is the key for i18n
// - type: 'conversable' | 'assistant' | 'user' | 'group', indicates the classes for code generation
// - class: The class to be choosen during code generation
// - (description): UI will look for value of label + '-description', for example 'assistant-description'
export type NodeMeta = {
  id?: string;
  name: string;
  description?: string;
  icon?: Icon;
  type: string;
  label: string;
  class: string;
};

export const basicNodes: NodeMeta[] = [
  {
    id: 'initializer',
    icon: Icons.rocket,
    name: 'Initializer',
    label: 'initializer',
    type: 'initializer',
    class: 'Initializer',
  },
  {
    id: 'groupchat',
    icon: Icons.group,
    name: 'Group',
    label: 'groupchat',
    type: 'groupchat',
    class: 'GroupChat',
  },
  {
    id: 'nestedchat',
    icon: Icons.group,
    name: 'Nested Chat',
    label: 'nestedchat',
    type: 'nestedchat',
    class: 'NestedChat',
  },
  {
    id: 'note',
    icon: Icons.note,
    name: 'Note',
    label: 'note',
    type: 'note',
    class: 'Note',
  },
];

export const agentNodes: NodeMeta[] = [
  {
    id: 'conversable',
    icon: Icons.robot,
    name: 'Agent',
    label: 'conversable',
    type: 'conversable',
    class: 'ConversableAgent',
  },
  {
    id: 'user',
    icon: Icons.user,
    name: 'User',
    label: 'user',
    type: 'user',
    class: 'UserProxyAgent',
  },
  {
    id: 'assistant',
    icon: Icons.robot,
    name: 'Assistant',
    label: 'assistant',
    type: 'assistant',
    class: 'AssistantAgent',
  },
];

export const advancedNodes: NodeMeta[] = [
  {
    id: 'retrieve_assistant',
    icon: Icons.robot,
    name: 'RetrieveAssistant',
    label: 'retrieve-assistant',
    type: 'assistant',
    class: 'RetrieveAssistantAgent',
  },
  {
    id: 'retrieve_user',
    icon: Icons.search,
    name: 'RetrieveUserProxy',
    label: 'retrieve-user',
    type: 'user',
    class: 'RetrieveUserProxyAgent',
  },
  {
    id: 'gpt_assistant',
    icon: Icons.brain,
    name: 'GPTAssistant',
    label: 'gpt-assistant',
    type: 'gpt_assistant',
    class: 'GPTAssistantAgent',
  },
  // {
  //   id: 'multimodal',
  //   icon: Icons.Eye,
  //   name: 'MultimodalAssistant',
  //   label: 'multimodal-assistant',
  //   type: 'mm_assistant',
  //   class: 'MultimodalConversableAgent',
  // },
  // {
  //   id: 'llava',
  //   icon: Icons.Meta,
  //   name: 'LLaVA',
  //   label: 'llava',
  //   type: 'assistant',
  //   class: 'LLaVAAgent',
  // },
  // {
  //   id: 'math_user_proxy',
  //   icon: Icons.User4,
  //   name: 'MathUserProxyAgent',
  //   label: 'math-user',
  //   type: 'user',
  //   class: 'MathUserProxyAgent',
  // },
];

export const getNodeLabel = (label: string, tNodeMeta: any) => {
  // t() function is hook-based, so here the caller from component should pass in the function
  return tNodeMeta && label ? tNodeMeta(label) : label;
};

const allNodes = [...basicNodes, ...agentNodes, ...advancedNodes];

export const getNodeIcon = (type: string) => {
  const nodeMeta = allNodes.find((node) => node.type === type);
  return nodeMeta?.icon || Icons.question;
};

// ---------------------

export const setNodeData = (
  instance: ReactFlowInstance,
  id: string,
  dataset: { [key: string]: any },
  scope: string = ''
) => {
  const nodes = instance.getNodes();
  instance.setNodes(
    nodes.map((node: any) => {
      if (node.id === id) {
        if (scope) {
          node.data = {
            ...node.data,
            [scope]: { ...node.data[scope], ...dataset },
          };
        } else node.data = { ...node.data, ...dataset };
      }
      return node;
    })
  );
};

export const setEdgeData = (
  instance: ReactFlowInstance,
  id: string,
  dataset: { [key: string]: any },
  scope: string = ''
) => {
  const edges = instance.getEdges();
  instance.setEdges(
    edges.map((edge: any) => {
      if (edge.id === id) {
        if (scope) {
          edge.data = {
            ...edge.data,
            [scope]: { ...edge.data[scope], ...dataset },
          };
        } else edge.data = { ...edge.data, ...dataset };
      }
      return edge;
    })
  );
};

export const getFlowName = (nodes: Node[]) => {
  const configNode = nodes.find((node: any) => node.type === 'config');
  let name = 'flow-unknown';
  if (configNode && configNode?.data.flow_name) {
    name = configNode.data.flow_name;
  } else {
    name = 'flow-' + genId();
  }
  return name;
};

export const getFlowDescription = (nodes: Node[]) => {
  const configNode = nodes.find((node: any) => node.type === 'config');
  let description = '';
  if (configNode && configNode?.data.flow_description) {
    description = configNode.data.flow_description;
  }
  return description;
};

export const isFlowDirty = (flow1: any, flow2: any) =>
  !deepEqual(flow1, flow2, ['selected', 'dragging']);

export function deepEqual(obj1: any, obj2: any, ignoreKeys: string[] = []) {
  if (obj1 === obj2) {
    return true;
  }

  const keys1 = Object.keys(obj1).filter((key) => !ignoreKeys.includes(key));
  const keys2 = Object.keys(obj2).filter((key) => !ignoreKeys.includes(key));

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2, ignoreKeys)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object: any) {
  return object != null && typeof object === 'object';
}

export function formatData(data: any) {
  let markdown = '| Key | Value |\n| --- | --- |\n';
  Object.entries(data).map(
    ([key, value]) => (markdown += `| ${key} | ${value} |\n`)
  );
  return markdown;
}
