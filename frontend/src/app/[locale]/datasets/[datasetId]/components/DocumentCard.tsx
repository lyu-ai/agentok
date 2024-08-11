"use client";
import { useChunks, useDocument } from "@/hooks";
import { getFileIcon } from "@/utils/icon";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiDeleteBin4Line, RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

const DocumentCard = ({
  document,
  onDelete,
  selected,
  className,
  ...props
}: any) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { updateDocument } = useDocument(document.dataset_id, document.id);
  const { chunks } = useChunks(document.dataset_id, document.id);
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    setIsDeleting(true);
    onDelete && (await onDelete(document).finally(() => setIsDeleting(false)));
  };
  const [enabled, setEnabled] = useState(document.enabled || true);
  useEffect(() => {
    updateDocument({ enabled: !document.enabled });
  }, [enabled]);

  if (!document) {
    return null;
  }

  console.log(document);

  const FileIcon = getFileIcon(document.path);

  return (
    <Link
      href={`/datasets/${document.dataset_id}/documents/${document.id}`}
      className={clsx(
        "relative group w-full flex flex-col gap-2 p-3 h-48 rounded-md bg-base-content/10 border-base-content/20 hover:bg-base-content/20 border cursor-pointer hover:shadow-box hover:shadow-gray-700",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 h-12">
        <FileIcon className="w-9 h-9 flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <div className="text-sm font-bold text-ellipsis line-clamp-1">
            {document.name}
          </div>
          <div className="text-xs text-base-content/50">
            {new Date(document.created_at).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="h-20 line-clamp-4 text-xs text-base-content/50 overflow-hidden">
        {chunks.length > 0 && chunks[0].content}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="toggle toggle-xs toggle-success"
            checked={document.enabled}
            onChange={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setEnabled(e.target.checked);
            }}
          />
          <div className="text-xs text-base-content/50 px-2 py-0.5 border border-base-content/20 rounded-full">
            {document.status === "completed" ? (
              <span className="text-success">{chunks.length} chunks</span>
            ) : (
              <span className="text-warning">processing...</span>
            )}
          </div>
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
    </Link>
  );
};

export default DocumentCard;
