'use client';

import { ReactFlowProvider } from 'reactflow';
import Autoflow from '../../components/Flow';
import { useFlow } from '@/hooks';
import { useEffect } from 'react';

const Page = ({ params }: { params: { id: string } }) => {
  const { flow } = useFlow(params.id);

  useEffect(() => {
    if (flow?.name && typeof window !== 'undefined') {
      document.title = `${flow.name} | FlowGen`;
    }
  }, [flow?.name]);

  return (
    <ReactFlowProvider key="reactflow-flow">
      <Autoflow flowId={params.id} />
    </ReactFlowProvider>
  );
};

export default Page;
