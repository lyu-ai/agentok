import SidebarLayout from '@/components/sidebar-layout';
import { PropsWithChildren } from 'react';
import { settingList } from './settings';
import Navbar from '@/components/navbar/navbar';
import { ScrollArea } from '@/components/ui/scroll-area';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-col h-screen w-screen'>
      <Navbar />
      <SidebarLayout sidebarItems={settingList}>
        {children}
      </SidebarLayout>
    </div>
  );
};

export default Layout;
