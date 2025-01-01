import SidebarLayout from '@/components/sidebar-layout';
import { PropsWithChildren } from 'react';
import { settingList } from './project-settings';

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  return (
    <SidebarLayout pathPrefix={`/projects/${id}`} sidebarItems={settingList}>
      {children}
    </SidebarLayout>
  );
}
