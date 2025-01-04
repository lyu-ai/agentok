'use client';

import { useReactFlow, NodeProps } from '@xyflow/react';
import Tip from '@/components/tip';
import { GenericNode } from './generic-node';
import { ComponentType } from 'react';

export const SummarizerNode: ComponentType<NodeProps> = ({
  id,
  data,
  ...props
}) => {
  const instance = useReactFlow();

  return (
    <GenericNode
      id={id}
      data={data}
      {...props}
      ports={[{ type: 'target', name: '' }]}
    >
      <div className="py-1 text-sm">Summarize the chat history</div>
      <div className="flex items-center gap-2">
        <span>Summary Method</span>
        <Tip content="Sample messages that will be shown in the chat panel" />
      </div>
    </GenericNode>
  );
};
