import SidebarLayout from '@/components/SidebarLayout';
import { PropsWithChildren } from 'react';
import { settingList } from './project-settings';

const Layout = ({
  children,
  params,
}: PropsWithChildren<{ params: { projectId: string } }>) => {
  return (
    <SidebarLayout
      pathPrefix={`/projects/${params.projectId}`}
      sidebarItems={settingList}
    >
      {children}
    </SidebarLayout>
  );
};

export default Layout;
