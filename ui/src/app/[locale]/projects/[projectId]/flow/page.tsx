'use client';

import { ReactFlowProvider } from 'reactflow';
import Flow from './components/Flow';

const Page = ({ params }: { params: { projectId: string } }) => {
  const projectId = parseInt(params.projectId, 10);
  return (
    <ReactFlowProvider key="agentok-reactflow">
      <Flow projectId={projectId} />
    </ReactFlowProvider>
  );
};

export default Page;
