import SidebarLayout from '@/components/SidebarLayout';
import { PropsWithChildren } from 'react';
import { settingList } from './settings';

const Layout = ({ children }: PropsWithChildren) => {
  return <SidebarLayout sidebarItems={settingList}>{children}</SidebarLayout>;
};

export default Layout;
