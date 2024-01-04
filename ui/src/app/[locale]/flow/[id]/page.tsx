'use client';

import { ReactFlowProvider } from 'reactflow';
import Autoflow from '../../components/Flow';
import { useFlow, useFlows } from '@/hooks';
import { use, useEffect } from 'react';

const Page = ({ params }: { params: { id: string } }) => {
  const { flow } = useFlow(params.id);
  const { activeFlowId, openFlow } = useFlows();

  useEffect(() => {
    if (flow?.name && typeof window !== 'undefined') {
      document.title = `${flow.name} | FlowGen`;
    }
  }, [flow?.name]);

  useEffect(() => {
    openFlow(params.id);
  }, [params.id]);

  return (
    <ReactFlowProvider key="reactflow-flow">
      <Autoflow flowId={params.id} />
    </ReactFlowProvider>
  );
};

export default Page;
