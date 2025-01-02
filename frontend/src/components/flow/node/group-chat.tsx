import { NodeProps } from '@xyflow/react';
import { GroupChatConfig } from '../config/group-chat';
import { GenericNode } from './generic-node';

export const GroupChatManager = (props: NodeProps) => {
  return (
    <GenericNode
      resizable
      nodeClass="group"
      ConfigDialog={GroupChatConfig}
      ports={[{ type: 'source', name: '' }]}
      {...props}
    />
  );
};
