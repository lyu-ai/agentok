import { NodeProps } from '@xyflow/react';
import { GenericNode } from './generic-node';
import { ComponentType } from 'react';

export const ConversableAgent: ComponentType<NodeProps> = ({
  id,
  data,
  selected,
  ...props
}: NodeProps) => {
  return (
    <GenericNode
      id={id}
      data={data}
      selected={selected}
      ports={[
        { type: 'target', name: 'input' },
        { type: 'source', name: 'output' },
      ]}
      nodeClass="agent"
      {...props}
    ></GenericNode>
  );
};
