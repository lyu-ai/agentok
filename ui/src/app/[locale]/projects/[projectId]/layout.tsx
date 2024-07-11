'use client';
import { ProjectProvider } from '@/context/ProjectContext';
import { useProject } from '@/hooks';
import { PropsWithChildren, useEffect } from 'react';

export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { projectId: string } }>) {
  const { project } = useProject(params.projectId);

  useEffect(() => {
    if (project?.name && typeof window !== 'undefined') {
      document.title = `${project.name} | Agentok Studio`;
    }
  }, [project?.name]);
  return (
    <div className="flex-1 w-full overflow-y-auto">
      <ProjectProvider projectId={params.projectId}>{children}</ProjectProvider>
    </div>
  );
}
