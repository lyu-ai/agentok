"use client";
import clsx from "clsx";
import { use, useEffect, useState } from "react";
import { RiDeleteBin4Line, RiTextBlock } from "react-icons/ri";

const ChunkCard = ({
  datasetId,
  chunk,
  onDelete,
  onSelect,
  onUpdate,
  selected,
  className,
  ...props
}: any) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [enabled, setEnabled] = useState(chunk.enabled || true);
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    setIsDeleting(true);
    onDelete && (await onDelete(document).finally(() => setIsDeleting(false)));
  };

  useEffect(() => {
    setEnabled(chunk.enabled || true);
  }, [chunk]);

  useEffect(() => {
    onUpdate(chunk.id, { enabled });
  }, [enabled]);

  if (!document) {
    return null;
  }

  return (
    <div
      onClick={() => onSelect(chunk)}
      className={clsx(
        "relative group w-full flex flex-col gap-1 max-w-sm rounded-md border cursor-pointer hover:shadow-box",
        "bg-base-content/10 border-base-content/20 hover:bg-base-content/20 hover:shadow-gray-700",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between w-full border-b border-base-content/10 p-1 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <RiTextBlock className="w-4 h-4 flex-shrink-0" />
          <div className="font-bold">{chunk.chunk_index + 1}</div>
        </div>
        <input
          type="checkbox"
          className="toggle toggle-xs toggle-success"
          checked={enabled}
          onChange={(e) => {
            e.preventDefault();
            setEnabled(e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="p-1">
        <div className="text-sm line-clamp-6">{chunk.content}</div>
      </div>
      <div className="flex items-center justify-between w-full p-1">
        <div className="text-xs text-base-content/50">
          {chunk.content.length}
        </div>
        <button
          className="btn btn-xs btn-square btn-ghost hover:text-red-600"
          onClick={handleDelete}
        >
          {isDeleting ? (
            <div className="loading loading-xs" />
          ) : (
            <RiDeleteBin4Line className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChunkCard;
