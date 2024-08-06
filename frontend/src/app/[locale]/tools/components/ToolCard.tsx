import { useUser } from "@/hooks";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiFormula, RiDeleteBin4Line, RiCodeLine } from "react-icons/ri";

const ToolCard = ({ tool, onDelete, selected, className, ...props }: any) => {
  const [isOwned, setIsOwned] = useState(false);
  const { userId } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    setIsOwned(tool.user_id === userId);
  }, [tool, userId]);
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    setIsDeleting(true);
    onDelete && (await onDelete(tool).finally(() => setIsDeleting(false)));
  };

  return (
    <label
      className={clsx(
        "relative group w-full flex flex-col gap-2 p-3 rounded-md border cursor-pointer hover:bg-base-content/10 hover:shadow-box hover:shadow-gray-700",
        selected
          ? "shadow-box shadow-gray-600 bg-gray-700/90 border-gray-600"
          : "border-base-content/10 bg-base-content/5",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <img
          src={tool.logo_url ?? "/images/tools-solid.svg"}
          className="w-12 h-12 flex-shrink-0"
        />
        <div className="text-base font-bold">{tool.name}</div>
      </div>
      <div className="text-sm text-base-content/50 w-full line-clamp-4 min-h-28">
        {tool.description}
      </div>
      {isOwned && (
        <div className="absolute bottom-2 left-2 hidden group-hover:block text-xs text-base-content/50">
          <Link
            href={`/tools/${tool.id}`}
            className="gap-1 btn btn-xs btn-ghost"
          >
            <RiCodeLine className="w-4 h-4" />
            Develop
          </Link>
        </div>
      )}
      <div className="absolute bottom-2 right-2 hidden group-hover:block">
        {!tool.is_public && (
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
        )}
      </div>
    </label>
  );
};

export default ToolCard;
