'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { FlowEditor } from '@/components/flow/flow-editor';
import { useProjects } from '@/hooks';
import { useEffect } from 'react';
import { use } from 'react';
import NotFound from '@/app/not-found';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const projectId = parseInt(id, 10);
  const { projects, activeProjectId, setActiveProjectId } = useProjects();
  useEffect(() => {
    if (projectId !== activeProjectId) {
      setActiveProjectId(projectId);
    }
  }, [projectId]);

  if (!projects.find((project) => project.id === projectId)) {
    return <NotFound />;
  }
  return (
    <ReactFlowProvider key="agentok-reactflow">
      <FlowEditor projectId={projectId} />
    </ReactFlowProvider>
  );
};

export default Page;
