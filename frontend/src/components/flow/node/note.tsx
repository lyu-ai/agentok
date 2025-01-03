'use client';

import React, { memo, useEffect, useState } from 'react';
import { useReactFlow, NodeProps } from '@xyflow/react';
import Markdown from '@/components/markdown';
import { setNodeData } from '@/lib/flow';
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
    <div
      className="w-full min-w-[200px] min-h-[100px] cursor-text bg-yellow-500/40 rounded-md p-2"
      onClick={() => setEditing(true)}
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
    </div>
  );
});
