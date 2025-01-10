'use client';

import { NodeProps } from '@xyflow/react';
import { GenericNode } from './generic-node';
import { ComponentType } from 'react';

export const CaptainAgentNode: ComponentType<NodeProps> = ({
  id,
  data,
  selected,
  type,
  ...props
}: NodeProps) => {
  return (
    <GenericNode
      {...props}
      id={id}
      data={data}
      selected={selected}
      type={type}
      ports={[{ type: 'target', name: '' }]}
    />
  );
};
