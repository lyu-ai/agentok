import { NodeProps } from '@xyflow/react';
import { GroupChatConfig } from '../config/group-chat';
import { GenericNode } from './generic-node';

export const GroupChatManager = (props: NodeProps) => {
  return (
    <GenericNode
      config={GroupChatConfig}
      ports={[{ type: 'source', name: '' }]}
      {...props}
    />
  );
};
