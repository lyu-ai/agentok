import { NodeProps } from '@xyflow/react';
import { ConversableAgentConfig } from '../config/conversable-agent';
import { GenericNode } from './generic-node';

export const RetrieveUserProxyAgent = ({
  id,
  selected,
  data,
  ...props
}: NodeProps) => {
  return (
    <GenericNode
      {...props}
      id={id}
      data={data}
      selected={selected}
      ports={[{ type: 'source', name: '' }, { type: 'target', name: '' }]}
      config={ConversableAgentConfig}
      {...props}
    />
  );
};
