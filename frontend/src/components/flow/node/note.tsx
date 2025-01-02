'use client';

import React, { memo, useEffect, useState } from 'react';
import { useReactFlow, NodeProps } from '@xyflow/react';
import Markdown from '@/components/markdown';
import { setNodeData } from '@/lib/flow';
import { GenericNode } from './generic-node';
import { Icons } from '@/components/icons';
import { Textarea } from '@/components/ui/textarea';

export const NoteNode = memo(({
  id,
  data,
  selected,
  type,
  ...props
}: NodeProps) => {
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
    <GenericNode
      id={id}
      data={data}
      selected={selected}
      type={type}
      nodeClass="general"
      {...props}
      className="min-w-80"
    >
      {editing ? (
        <Textarea
          autoFocus
          className="textarea textarea-bordered w-full min-h-[100px] text-sm"
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
    </GenericNode>
  );
});
