'use client';

import { ReactFlowProvider } from 'reactflow';
import Flow from './components/Flow';

const Page = ({ params }: { params: { projectId: string } }) => {
  return (
    <ReactFlowProvider key="agentok-reactflow">
      <Flow projectId={params.projectId} />
    </ReactFlowProvider>
  );
};

export default Page;
