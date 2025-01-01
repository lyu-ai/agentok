import { NodeProps } from 'reactflow';
import { GroupChatConfig } from '../config/group-chat';
import { GenericNode } from './generic-node';

export const GroupChatManager = (props: NodeProps) => {
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
