'use client';

import { NodeProps } from '@xyflow/react';
import { GenericNode } from './generic-node';
import { GenericOption } from '../option/option';
import { ComponentType } from 'react';

export const AssistantNode: ComponentType<NodeProps> = ({
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
      ports={[
        { type: 'target', name: '' },
        { type: 'source', name: '' },
      ]}
    />
  );
};
