'use client';

import { ReactFlowProvider } from 'reactflow';
import Workflow from '../../components/Flow';
import { useFlow, useFlows } from '@/hooks';
import { useEffect } from 'react';

const Page = ({ params }: { params: { id: string } }) => {
  const { flow } = useFlow(params.id);
  const { openFlow } = useFlows();

  useEffect(() => {
    if (flow?.name && typeof window !== 'undefined') {
      document.title = `${flow.name} | Agentok Studio`;
    }
  }, [flow?.name]);

  useEffect(() => {
    openFlow(params.id);
  }, [params.id, openFlow]);

  return (
    <ReactFlowProvider key="reactflow-flow">
      <Workflow flowId={params.id} />
    </ReactFlowProvider>
  );
};

export default Page;
