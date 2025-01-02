'use client';

import clsx from 'clsx';
import { useReactFlow, NodeProps } from 'reactflow';
import { setNodeData } from '@/lib/flow';
import Tip from '@/components/tip';
import { isArray } from 'lodash-es';
import { GenericNode } from './generic-node';

interface InitializerProps extends NodeProps {
  id: string;
  data: any;
  selected: boolean;
  type: string;
  zIndex: number;
  isConnectable: boolean;
  xPos: number;
  yPos: number;
  dragging: boolean;
}

export const InitializerNode = ({
  id,
  data,
  selected,
  type,
  zIndex,
  isConnectable,
  xPos,
  yPos,
  dragging,
}: InitializerProps) => {
  const instance = useReactFlow();

  return (
    <GenericNode
      id={id}
      data={data}
      selected={selected}
      type={type}
      zIndex={zIndex}
      isConnectable={isConnectable}
      xPos={xPos}
      yPos={yPos}
      dragging={dragging}
      nodeClass="general"
      className="min-w-80"
      ports={[{ type: 'source', name: '' }]}
    >
      <div className="py-1 text-sm">
        Configure initial settings for the chat session
      </div>
      <div className="flex items-center gap-2">
        <span>Sample Messages</span>
        <Tip content="Sample messages that will be shown in the chat panel" />
      </div>
      <textarea
        className="textarea textarea-bordered w-full min-h-[100px] text-sm"
        value={isArray(data.sample_messages) ? data.sample_messages.join('\n') : ''}
        placeholder="Enter sample messages, one per line..."
        onChange={(e) =>
          setNodeData(instance, id, {
            sample_messages: e.target.value.split('\n'),
          })
        }
      />
    </GenericNode>
  );
};
