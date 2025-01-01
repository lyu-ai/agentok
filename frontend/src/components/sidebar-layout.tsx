import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { Sidebar, SidebarItem } from './sidebar';

type SidebarLayoutProps = {
  pathPrefix?: string;
  sidebarItems: SidebarItem[];
};

const SidebarLayout = ({
  pathPrefix,
  sidebarItems,
  children,
}: PropsWithChildren<SidebarLayoutProps>) => {
  return (
    <div
      className={clsx(
        'flex flex-1 h-full w-full items-center text-base-content p-1 gap-2',
        'bg-gradient-to-r from-primary/10 via-40% via-blue-50/20 to-primary/20'
      )}
    >
      <Sidebar items={sidebarItems} pathPrefix={pathPrefix} />
      <div className="flex flex-1 w-full h-full overflow-y-auto bg-base-100/50 dark:bg-base-content/10 rounded-lg p-4 shadow">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
