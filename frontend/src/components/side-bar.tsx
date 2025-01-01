'use client';

import { useMediaQuery } from '@/hooks';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { isParentPath } from '@/lib/path';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SidebarItem {
  name: string;
  icon: IconType;
  activeIcon?: IconType;
  path: string;
}

type SidebarProps = {
  pathPrefix?: string;
  items: SidebarItem[];
};

export const Sidebar = ({ pathPrefix, items }: SidebarProps) => {
  const pathname = usePathname();
  const isMedium = useMediaQuery('only screen and (max-width : 769px)');

  return (
    <div className="flex flex-col gap-2 md:w-48 h-full">
      {items.map((item) => {
        const path = pathPrefix ? `${pathPrefix}${item.path}` : item.path;
        const isActive = isParentPath(pathname, path);
        const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;

        const linkContent = (
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              isMedium && "px-2",
              !isMedium && "px-4"
            )}
            asChild
          >
            <Link href={path}>
              <Icon className="w-4 h-4" />
              <span className={cn("hidden md:inline-flex")}>{item.name}</span>
            </Link>
          </Button>
        );

        return isMedium ? (
          <TooltipProvider key={item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                {linkContent}
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          linkContent
        );
      })}
    </div>
  );
};

export default Sidebar;
