import { getAvatarUrl, getIconUrl } from '@/utils/supabase/client';
import { useState } from 'react';
import { RiGitForkLine } from 'react-icons/ri';

const SharedTool = ({ tool, onFork }: any) => {
  const [isForking, setIsForking] = useState(false);
  const handleFork = async () => {
    setIsForking(true);
    await onFork(tool.id).finally(() => setIsForking(false));
  };
  const iconUrl = getIconUrl(tool);
  return (
    <div className="group card shadow flex flex-col items-start w-80 bg-base-content/10 border border-base-content/20 hover:border-primary/50 p-4 gap-2">
      <div className="flex items-center gap-2">
        <img src={iconUrl} alt="icon" width={64} height={64} />
        <div className="flex flex-col items-start gap-3">
          <div className="text-lg font-bold">{tool.name}</div>
          <div className="flex gap-2 items-center text-xs text-base-content/60">
            {tool.expand?.owner?.avatar && (
              <img
                src={getAvatarUrl(tool.expand?.owner)}
                height={24}
                width={24}
                alt="owner"
                className="w-6 h-6 rounded-full"
              />
            )}
            {tool.expand?.owner?.name ?? tool.expand?.owner?.email ?? ''}
          </div>
        </div>
      </div>
      <p className="flex-1 text-sm text-base-content/80 line-clamp-3 text-left">
        {tool.description}
      </p>
      <div className="card-actions flex w-full justify-end mt-4">
        <button
          onClick={handleFork}
          className="btn btn-xs btn-ghost rounded flex gap-1"
        >
          {isForking ? (
            <div className="loading loading-xs" />
          ) : (
            <RiGitForkLine className="h-4 w-4" />
          )}
          <span>Fork</span>
        </button>
      </div>
    </div>
  );
};

export default SharedTool;
