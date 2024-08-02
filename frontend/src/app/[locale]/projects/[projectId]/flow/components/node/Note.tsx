import React, { memo, useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';
import Markdown from '@/components/Markdown';
import { setNodeData } from '../../utils/flow';
import { useTranslations } from 'next-intl';
import GenericNode from './GenericNode';
import { RiCheckLine, RiCloseLine, RiEdit2Line } from 'react-icons/ri';

function Note({ id, data, ...props }: any) {
  const instance = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(data.content);
  const t = useTranslations('node.Note');

  useEffect(() => setContent(data.content), [data.content]);

  return (
    <GenericNode id={id} data={data} nodeClass="note" resizable {...props}>
      <div className="absolute top-0 right-0 flex items-center gap-2 justify-between">
        {editing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Cancel editing"
              className="btn btn-xs btn-ghost btn-square rounded"
              onClick={() => setEditing(!editing)}
            >
              <RiCloseLine className="text-red-500 w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Confirm editing"
              className="btn btn-xs btn-ghost btn-square rounded"
              onClick={e => {
                setEditing(false);
                setNodeData(instance, id, { content: content });
              }}
            >
              <RiCheckLine className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Edit note"
            className="btn btn-xs btn-ghost btn-square rounded"
            onClick={() => setEditing(!editing)}
          >
            <RiEdit2Line className="w-4 h-4" />
          </button>
        )}
      </div>
      <div
        className="w-full h-full text-sm text-white/80 overflow-y-auto"
        onDoubleClick={() => {
          setEditing(true);
        }}
      >
        {editing && (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t('note-placeholder')}
            className="nodrag nowheel textarea w-full h-full p-2 bg-base-content/20 rounded"
            rows={6}
          />
        )}
        {!editing && (
          <Markdown className="p-2">
            {data.content ?? t('note-placeholder')}
          </Markdown>
        )}
      </div>
    </GenericNode>
  );
}

export default memo(Note);
