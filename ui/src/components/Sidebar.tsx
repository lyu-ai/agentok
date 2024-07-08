'use client';
import { useMediaQuery } from '@/hooks';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { isParentPath } from '@/utils/path';

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

const Sidebar = ({ pathPrefix, items }: SidebarProps) => {
  const pathname = usePathname();
  const isMedium = useMediaQuery('only screen and (max-width : 769px)');
  return (
    <div className="flex flex-col gap-2 md:w-48 h-full">
      {items.map(item => {
        const path = pathPrefix ? `${pathPrefix}${item.path}` : item.path;
        const isActive = isParentPath(pathname, path);
        const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;
        return (
          <Link
            key={item.name}
            className={clsx(
              'flex items-center px-2 md:px-4 py-2 gap-1  text-sm rounded-lg hover:bg-base-content/5',
              {
                'bg-base-100/50 dark:bg-base-content/20 shadow text-primary': isActive,
                'tooltip tooltip-right': isMedium,
              }
            )}
            href={path}
            data-tip={item.name}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden md:flex">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
