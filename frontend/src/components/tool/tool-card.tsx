import { useTool, useToolSettings, useUser } from '@/hooks';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icons } from '../icons';

export const ToolCard = ({ tool, selected, className, ...props }: any) => {
  const [isOwned, setIsOwned] = useState(false);
  const { userId } = useUser();
  const { deleteTool, isDeleting } = useTool(tool.id);
  const { settings } = useToolSettings();
  const [needConfig, setNeedConfig] = useState(false);
  useEffect(() => {
    setIsOwned(tool.user_id === userId);
    setNeedConfig(
      tool.variables?.length > 0 &&
        tool.variables.some(
          (v: any) =>
            !settings[tool.id]?.variables[v.name] ||
            settings[tool.id].variables[v.name] === ''
        )
    );
  }, [tool, settings, userId]);
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    await deleteTool();
  };

  return (
    <label
      className={clsx(
        'relative group w-full flex flex-col gap-2 p-3 rounded-md border cursor-pointer hover:bg-base-content/10 hover:shadow-box hover:shadow-gray-700',
        selected
          ? 'shadow-box shadow-gray-600 bg-gray-700/90 border-gray-600'
          : 'border-base-content/10 bg-base-content/5',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <img
          src={tool.logo_url ?? '/images/tools.svg'}
          className="w-12 h-12 flex-shrink-0"
        />
        <div className="flex flex-col items-start gap-1">
          <div className="text-base font-bold">{tool.name}</div>
          {tool.user_name && (
            <div className="flex items-center gap-1">
              <img src={tool.user_avatar} className="w-4 h-4 rounded-full" />
              <span className="text-xs text-base-content/50">
                {tool.user_name}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-base-content/50 w-full line-clamp-4 min-h-28">
        {tool.description}
      </div>
      {isOwned && (
        <div className="absolute bottom-2 left-2 text-xs text-base-content/50">
          <Link href={`/tools/${tool.id}`} className="gap-1 btn btn-xs">
            <Icons.code className="w-4 h-4" />
            Develop
          </Link>
        </div>
      )}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {needConfig && (
          <span className="text-xs bg-yellow-600 text-white p-1 rounded">
            Not Configured
          </span>
        )}
      </div>
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        {!tool.is_public && (
          <button
            className="btn btn-xs btn-square btn-ghost hover:text-red-600"
            onClick={handleDelete}
          >
            {isDeleting ? (
              <div className="loading loading-xs" />
            ) : (
              <Icons.trash className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </label>
  );
};
