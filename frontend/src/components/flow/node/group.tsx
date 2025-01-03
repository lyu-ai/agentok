'use client';

import React from 'react';
import { NodeProps, NodeResizer, Handle, Position } from '@xyflow/react';
import { GroupChatConfig } from '../config/group-chat';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

interface GroupNodeData extends Record<string, unknown> {
  name?: string;
  isHighlighted?: boolean;
}

export const GroupNode = ({
  id,
  data,
  selected,
  ...props
}: NodeProps) => {
  const [showConfig, setShowConfig] = React.useState(false);
  const nodeData = data as GroupNodeData;

  return (
    <div className="relative">
      <NodeResizer
        minWidth={400}
        minHeight={300}
        isVisible={selected}
        handleClassName="w-2 h-2 bg-primary border-2 border-white rounded-none"
        lineClassName="border border-primary"
        keepAspectRatio={false}
      />
      <div className={cn(
        'flex flex-col min-w-[400px] min-h-[300px] p-2',
        'bg-muted/5 backdrop-blur-sm rounded-xl',
        'border-2 border-dashed transition-colors',
        selected ? 'border-purple-500 text-purple-500' : 'border-primary/20',
        nodeData.isHighlighted && 'border-primary border-2 bg-primary/5'
      )}>
        <Handle
          type="target"
          position={Position.Left}
          className={cn(
            'w-3 h-3 rounded-full border-2 bg-base-content/10',
            'border-base-content/10 hover:border-primary',
            { 'border-primary': selected }
          )}
        />
        <Handle
          type="source"
          position={Position.Right}
          className={cn(
            'w-3 h-3 rounded-full border-2 bg-base-content/10',
            'border-base-content/10 hover:border-primary',
            { 'border-primary': selected }
          )}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.group className="w-5 h-5" />
            <span className="font-medium">{nodeData?.name || 'Group'}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Drop nodes here to group them
        </div>
      </div>
    </div>
  );
};
