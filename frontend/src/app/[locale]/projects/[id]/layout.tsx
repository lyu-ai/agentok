'use client';
import { ProjectProvider } from '@/context/ProjectContext';
import { useProject } from '@/hooks';
import { PropsWithChildren, useEffect } from 'react';
import { use } from 'react';

export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) {
  const { id } = use(params);
  const projectId = parseInt(id, 10);
  const { project } = useProject(projectId);

  useEffect(() => {
    if (project?.name && typeof window !== 'undefined') {
      document.title = `${project.name} | Agentok Studio`;
    }
  }, [project?.name]);
  return (
    <div className="flex-1 w-full overflow-y-auto">
      <ProjectProvider projectId={projectId}>{children}</ProjectProvider>
    </div>
  );
}
