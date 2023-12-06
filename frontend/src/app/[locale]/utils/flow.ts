import AssistantAgent from '../components/node/Assistant';
import Config from '../components/node/Config';
import UserProxyAgent from '../components/node/UserProxy';
import GroupChat from '../components/node/GroupChat';
import Note from '../components/node/Note';
import { FaEye, FaMeta, FaRegNoteSticky, FaUserGroup } from 'react-icons/fa6';
import { RiChatSmile2Line, RiRobot2Line } from 'react-icons/ri';
import { SiOpenai } from 'react-icons/si';
import { Edge, Node, ReactFlowInstance } from 'reactflow';
import { genId } from '@/utils/id';
import { LuSettings2 } from 'react-icons/lu';

export const nodeTypes = {
  assistant: AssistantAgent,
  user: UserProxyAgent,
  config: Config,
  groupchat: GroupChat,
  note: Note,
};

export const nodeMetas = [
  {
    id: 'assistant',
    icon: RiRobot2Line,
    name: 'Assistant',
    label: '智能助理',
    type: 'assistant',
    class: 'AssistantAgent',
    description: '可用于一般的对话场景',
  },
  {
    id: 'gpt_assistant',
    icon: SiOpenai,
    name: 'GPTAssistant',
    label: 'GPT 智能助理',
    type: 'assistant',
    class: 'GPTAssistantAgent',
    description: '支持 GPT Assistant API',
  },
  {
    id: 'multimodal',
    icon: FaEye,
    name: 'MultimodalAssistant',
    label: '多模态智能助理',
    type: 'assistant',
    class: 'MultimodalConversableAgent',
    description: '多模态大模型，支持视觉识别',
  },
  {
    id: 'llava',
    icon: FaMeta,
    name: 'LLaVA',
    label: 'LLaVA',
    type: 'assistant',
    class: 'LLaVAAgent',
    description: '开源多模态大模型',
  },
  {
    id: 'groupchat',
    icon: FaUserGroup,
    type: 'groupchat',
    name: 'GroupChat',
    label: '群聊',
    class: 'GroupChat',
    description: '多人对话',
  },
  {
    id: 'note',
    icon: FaRegNoteSticky,
    name: 'Note',
    label: '笔记',
    type: 'note',
    class: 'Note',
    description: '笔记，增加细节描述',
  },
  {
    id: 'config',
    icon: LuSettings2,
    name: 'Config',
    label: '设置',
    type: 'config',
    class: 'Config',
    description: '全局配置项',
  },
  {
    id: 'user_proxy',
    icon: RiChatSmile2Line,
    name: 'UserProxy',
    label: '用户代理',
    type: 'user',
    class: 'UserProxyAgent',
    description: '用户代理，全局唯一',
  },
  {
    id: 'rag_assistant',
    icon: RiRobot2Line,
    name: 'RAGAssistant',
    label: 'RAG 助理',
    type: 'assistant',
    class: 'RetrieveAssistantAgent',
    description: 'RAG 助理',
  },
  {
    id: 'rag_user_proxy',
    icon: RiChatSmile2Line,
    name: 'RAGUserProxy',
    label: 'RAG 用户代理',
    type: 'user',
    class: 'RetrieveUserProxyAgent',
    description: 'RAG 用户代理，全局唯一',
  },
];

export const getNodeLabel = (_class: string) => {
  const nodeMeta = nodeMetas.find(meta => meta.class === _class);
  return nodeMeta?.label || _class;
};

// ---------------------

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'assistant',
    data: {
      name: 'Image',
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
      class: 'Note',
      content: '点击**开始聊天**按钮，选择一个样例图片并输入：这是什么。',
    },
    position: { x: 150, y: 700 },
  },
  {
    id: '999',
    type: 'config',
    data: {
      name: 'Config',
      flow_id: 'flow-sample1',
      flow_description: '示例流程',
      class: 'Config',
      max_tokens: 1024,
      temperature: 0.5,
    },
    position: { x: -200, y: 560 },
  },
];

export const initialEdges: Edge[] = [
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
  instance: ReactFlowInstance,
  id: string,
  dataset: { [key: string]: any },
  scope: string = ''
) => {
  const nodes = instance.getNodes();
  instance.setNodes(
    nodes.map(node => {
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

export const getFlowName = (nodes: Node[]) => {
  const configNode = nodes.find((node: any) => node.type === 'config');
  let name = 'flow-unknown';
  if (configNode && configNode?.data.flow_id) {
    name = configNode.data.flow_id;
  } else {
    name = 'flow-' + genId();
  }
  return name;
};
