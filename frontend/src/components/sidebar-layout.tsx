import { PropsWithChildren } from 'react';
import { Sidebar, SidebarItem } from './sidebar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@radix-ui/react-scroll-area';

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
      className={cn(
        'flex h-[calc(100vh-var(--header-height))] w-full gap-2 overflow-hidden'
      )}
    >
      <Sidebar
        items={sidebarItems}
        pathPrefix={pathPrefix}
        className="p-2 border-r"
      />
      <div className="flex flex-1 h-full w-full">{children}</div>
    </div>
  );
};

export default SidebarLayout;
