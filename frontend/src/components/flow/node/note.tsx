'use client';

import React, { memo, useEffect, useState } from 'react';
import {
  useReactFlow,
  NodeProps,
  NodeResizer,
  NodeResizeControl,
  NodeToolbar,
  Position,
} from '@xyflow/react';
import { Markdown } from '@/components/markdown';
import { setNodeData } from '@/lib/flow';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export const NoteNode = memo(
  ({ id, data, selected, type, ...props }: NodeProps) => {
    const [editing, setEditing] = useState(false);
    const instance = useReactFlow();

    useEffect(() => {
      if (!selected) {
        setEditing(false);
      }
    }, [selected]);

    const handleChange = (e: any) => {
      setNodeData(instance, id, {
        content: e.target.value,
      });
    };

    return (
      <div
        className="relative group flex flex-col gap-2 w-full min-w-[200px] min-h-[100px] bg-yellow-500/40 backdrop-blur-sm rounded-md p-2"
        onClick={() => setEditing(true)}
      >
        <NodeToolbar isVisible={selected} position={Position.Top} align={'end'}>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground/80 h-7 w-7"
            onClick={() => instance.deleteElements({ nodes: [{ id }] })}
          >
            <Icons.trash className="w-4 h-4" />
          </Button>
        </NodeToolbar>
        <div className="flex items-center gap-2">
          <Icons.note className="w-4 h-4" />
          <span className="text-xs">Note</span>
        </div>
        <NodeResizeControl
          minWidth={200}
          minHeight={100}
          style={{
            background: 'transparent',
            border: 'none',
          }}
        >
          <Icons.resize className="w-4 h-4" />
        </NodeResizeControl>
        {editing ? (
          <Textarea
            autoFocus
            className="w-full min-h-[100px] text-sm nodrag nowheel bg-white/10 focus:text-primary p-1 rounded"
            value={data.content as string}
            placeholder="Enter note content..."
            onChange={handleChange}
            onBlur={() => setEditing(false)}
          />
        ) : (
          <div
            className="w-full min-h-[100px] cursor-text"
            onClick={() => setEditing(true)}
          >
            <Markdown className="text-left text-sm">
              {data.content ?? 'Click to add note...'}
            </Markdown>
          </div>
        )}
      </div>
    );
  }
);
