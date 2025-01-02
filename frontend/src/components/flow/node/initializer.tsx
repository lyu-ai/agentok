'use client';

import { useReactFlow, NodeProps } from '@xyflow/react';
import { setNodeData } from '@/lib/flow';
import Tip from '@/components/tip';
import { isArray } from 'lodash-es';
import { GenericNode } from './generic-node';
import { ComponentType } from 'react';
import { Textarea } from '@/components/ui/textarea';

const InitializerNode: ComponentType<NodeProps> = ({ id, data, ...props }) => {
  const instance = useReactFlow();

  return (
    <GenericNode
      id={id}
      data={data}
      {...props}
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
      <Textarea
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

export { InitializerNode };
