import { NodeProps } from 'reactflow';
import GroupChatConfig from '../config/GroupChat';
import GenericNode from './GenericNode';

const GroupChatManager = (props: NodeProps) => {
  return (
    <GenericNode
      resizable
      nodeClass="group"
      ConfigDialog={GroupChatConfig}
      ports={[{ type: 'input', name: '' }]}
      {...props}
    />
  );
};

export default GroupChatManager;
