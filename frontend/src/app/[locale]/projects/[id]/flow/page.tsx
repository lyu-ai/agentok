'use client';

import { ReactFlowProvider } from 'reactflow';
import { Agentflow } from '@/components/flow/flow';
import { useProjects } from '@/hooks';
import { useEffect } from 'react';
import { use } from 'react';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const projectId = parseInt(id, 10);
  const { activeProjectId, setActiveProjectId } = useProjects();
  useEffect(() => {
    if (projectId !== activeProjectId) {
      setActiveProjectId(projectId);
    }
  }, [projectId]);
  return (
    <ReactFlowProvider key="agentok-reactflow">
      <Agentflow projectId={projectId} />
    </ReactFlowProvider>
  );
};

export default Page;
