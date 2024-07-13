import { NodeProps } from 'reactflow';
import { useTranslations } from 'next-intl';
import GroupChatConfig from '../config/GroupChat';
import GenericNode from './GenericNode';

const NestedChat = ({ id, data, ...props }: NodeProps) => {
  const t = useTranslations('node.NestedChat');
  return (
    <GenericNode
      id={id}
      data={data}
      {...props}
      nodeClass="group"
      nameEditable
      resizable
      ports={[
        { type: 'input', name: '' },
        { type: 'output', name: '' },
      ]}
      ConfigDialog={GroupChatConfig}
    ></GenericNode>
  );
};

export default NestedChat;
