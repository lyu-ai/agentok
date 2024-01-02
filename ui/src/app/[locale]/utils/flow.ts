import AssistantAgent from '../components/node/Assistant';
import Config from '../components/node/Config';
import UserProxyAgent from '../components/node/UserProxy';
import GroupChat from '../components/node/GroupChat';
import Note from '../components/node/Note';
import {
  RiChatSmile2Line,
  RiEyeLine,
  RiGroupLine,
  RiMetaLine,
  RiOpenaiFill,
  RiRobot2Line,
  RiSettingsLine,
  RiStickyNoteLine,
  RiUser4Line,
  RiUserSearchLine,
} from 'react-icons/ri';
import { genId } from '@/utils/id';
import CustomConversable from '../components/node/CustomConversable';
import { ComponentType } from 'react';

export const nodeTypes = {
  assistant: AssistantAgent,
  user: UserProxyAgent,
  config: Config,
  groupchat: GroupChat,
  note: Note,
  custom_conversable: CustomConversable,
};

// Fields of Node Meta:
// - name: To be used as variable name in generated code
// - label: Shown on UI, the value is the key for i18n
// - type: 'assistant' | 'user' | 'group', indicates the classes for code generation
// - class: The class to be choosen during code generation
// - (description): UI will look for value of label + '-description', for example 'assistant-description'
export type NodeMeta = {
  id?: string;
  name: string;
  description?: string;
  icon?: ComponentType;
  type: string;
  label: string;
  class: string;
};

export const basicNodes: NodeMeta[] = [
  {
    id: 'assistant',
    icon: RiRobot2Line,
    name: 'Assistant',
    label: 'assistant',
    type: 'assistant',
    class: 'AssistantAgent',
  },
  {
    id: 'user_proxy',
    icon: RiChatSmile2Line,
    name: 'UserProxy',
    label: 'user-proxy',
    type: 'user',
    class: 'UserProxyAgent',
  },
  {
    id: 'groupchat',
    icon: RiGroupLine,
    type: 'groupchat',
    name: 'GroupChat',
    label: 'groupchat',
    class: 'GroupChat',
  },
  {
    id: 'note',
    icon: RiStickyNoteLine,
    name: 'Note',
    label: 'note',
    type: 'note',
    class: 'Note',
  },
  {
    id: 'config',
    icon: RiSettingsLine,
    name: 'Config',
    label: 'config',
    type: 'config',
    class: 'Config',
  },
];

export const advancedNodes: NodeMeta[] = [
  {
    id: 'gpt_assistant',
    icon: RiOpenaiFill,
    name: 'GPTAssistant',
    label: 'gpt-assistant',
    type: 'assistant',
    class: 'GPTAssistantAgent',
  },
  {
    id: 'multimodal',
    icon: RiEyeLine,
    name: 'MultimodalAssistant',
    label: 'multimodal-assistant',
    type: 'assistant',
    class: 'MultimodalConversableAgent',
  },
  {
    id: 'llava',
    icon: RiMetaLine,
    name: 'LLaVA',
    label: 'llava',
    type: 'assistant',
    class: 'LLaVAAgent',
  },
  {
    id: 'retrieve_assistant',
    icon: RiRobot2Line,
    name: 'RetrieveAssistant',
    label: 'retrieve-assistant',
    type: 'assistant',
    class: 'RetrieveAssistantAgent',
  },
  {
    id: 'retrieve_user_proxy',
    icon: RiUserSearchLine,
    name: 'RetrieveUserProxy',
    label: 'retrieve-user-proxy',
    type: 'user',
    class: 'RetrieveUserProxyAgent',
  },
  {
    id: 'math_user_proxy',
    icon: RiUser4Line,
    name: 'MathUserProxyAgent',
    label: 'math-user-proxy',
    type: 'user',
    class: 'MathUserProxyAgent',
  },
];

export const getNodeLabel = (label: string, tNodeMeta: any) => {
  // t() function is hook-based, so here the caller from component should pass in the function
  return tNodeMeta && label ? tNodeMeta(label) : label;
};

// ---------------------

export const initialNodes: any[] = [
  {
    id: '1',
    type: 'assistant',
    data: {
      name: 'Image',
      type: 'assistant',
      label: 'multimodal-assistant',
      class: 'MultimodalConversableAgent',
      max_consecutive_auto_reply: 10,
    },
    position: { x: 145, y: 360 },
  },
  {
    id: '3',
    type: 'user',
    data: {
      name: 'UserProxy',
      label: 'user-proxy',
      class: 'UserProxyAgent',
      human_input_mode: 'NEVER',
      max_consecutive_auto_reply: 0,
    },
    position: { x: 550, y: 300 },
  },
  {
    id: '998',
    type: 'note',
    data: {
      name: 'Note',
      label: 'note',
      class: 'Note',
      content:
        'Click **Start Chat** and select a sample picture and then enter: What is this?',
    },
    position: { x: 150, y: 700 },
  },
  {
    id: '999',
    type: 'config',
    data: {
      name: 'Config',
      label: 'config',
      flow_name: 'sample-flow1',
      flow_description: 'Sample Autoflow',
      class: 'Config',
      max_tokens: 1024,
      temperature: 0.5,
    },
    position: { x: -200, y: 560 },
  },
];

export const initialEdges: any[] = [
  {
    id: '1-3',
    source: '1',
    target: '3',
    animated: true,
    type: 'smoothstep',
    style: {
      strokeWidth: 2,
    },
  },
];

export const setNodeData = (
  instance: any,
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

export const getFlowName = (nodes: any[]) => {
  const configNode = nodes.find((node: any) => node.type === 'config');
  let name = 'flow-unknown';
  if (configNode && configNode?.data.flow_name) {
    name = configNode.data.flow_name;
  } else {
    name = 'flow-' + genId();
  }
  return name;
};

export const getFlowDescription = (nodes: any[]) => {
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

  const keys1 = Object.keys(obj1).filter(key => !ignoreKeys.includes(key));
  const keys2 = Object.keys(obj2).filter(key => !ignoreKeys.includes(key));

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
