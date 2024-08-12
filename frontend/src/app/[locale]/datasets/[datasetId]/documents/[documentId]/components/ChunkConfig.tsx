import PopupDialog from '@/components/PopupDialog';
import { useEffect, useState } from 'react';
import { RiTextBlock } from 'react-icons/ri';

const ChunkConfig = ({ show, chunk, onUpdate, onClose }: any) => {
  const [content, setContent] = useState(chunk?.content || '');
  useEffect(() => {
    if (!chunk) return;
    setContent(chunk.content);
  }, [chunk]);
  if (!chunk) return null;
  return (
    <PopupDialog
      show={show}
      onClose={onClose}
      title={`Chunk #${chunk.chunk_index}`}
      className="w-full max-w-3xl"
      classNameBody="flex flex-col w-full p-2 gap-2"
    >
      <div className="p-2">
        <textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea textarea-bordered w-full p-2 bg-base-content/10 rounded"
        />
        <div className="flex items-center justify-end gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() =>
              onUpdate(chunk.id, { content: chunk.content }) && onClose()
            }
          >
            Save Changes
          </button>
        </div>
      </div>
    </PopupDialog>
  );
};

export default ChunkConfig;
