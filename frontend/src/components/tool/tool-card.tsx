import { useTool, useToolSettings, useUser } from '@/hooks';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';

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
      className={cn(
        'relative group w-full flex flex-col gap-2 p-3 rounded-md border cursor-pointer hover:bg-muted-foreground/20 hover:border-muted-foreground/10',
        selected
          ? 'bg-muted-foreground/20 border-muted-foreground/10'
          : 'border-muted-foreground/10 bg-muted-foreground/5',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Image
          src={tool.logo_url ?? '/images/tools.svg'}
          alt={tool.name}
          width={48}
          height={48}
          className="w-12 h-12 flex-shrink-0"
        />
        <div className="flex flex-col items-start gap-1">
          <div className="text-base font-bold">{tool.name}</div>
          {tool.user_name && (
            <div className="flex items-center gap-1">
              <Avatar className="w-4 h-4">
                <AvatarImage src={tool.user_avatar} />
                <AvatarFallback>{tool.user_name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-base-content/50">
                {tool.user_name}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-base-content/50 w-full line-clamp-4 min-h-14">
        {tool.description}
      </div>
      <div className="absolute bottom-2 left-2 flex items-center gap-2">
        {needConfig && (
          <span className="text-xs bg-yellow-600 text-white p-1 rounded">
            Not Configured
          </span>
        )}
      </div>
      <div className="absolute top-2 right-2 items-center gap-2">
        {tool.is_public && (
          <Badge variant="outline" className="text-xs">
            Public
          </Badge>
        )}
      </div>
      <div className="absolute bottom-2 right-2 hidden group-hover:flex items-center gap-2">
        {isOwned && (
          <Link href={`/tools/${tool.id}`}>
            <Button
              onClick={(e) => e.stopPropagation()}
              variant="ghost"
              size="icon"
              className="w-7 h-7"
            >
              <Icons.edit className="w-4 h-4" />
            </Button>
          </Link>
        )}
        {!tool.is_public && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="w-7 h-7"
          >
            {isDeleting ? (
              <Icons.spinner className="w-4 h-4 animate-spin text-red-600" />
            ) : (
              <Icons.trash className="w-4 h-4 text-red-600" />
            )}
          </Button>
        )}
      </div>
    </label>
  );
};
