'use client';

import { NodeProps } from '@xyflow/react';
import { ComponentType } from 'react';
import { GenericNode } from './generic-node';

export const InitializerNode: ComponentType<NodeProps> = ({
  id,
  data,
  ...props
}) => {
  return (
    <GenericNode
      id={id}
      data={data}
      {...props}
      ports={[{ type: 'source', name: '' }]}
    />
  );
};
