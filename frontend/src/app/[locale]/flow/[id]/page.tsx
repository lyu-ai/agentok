'use client';

import { ReactFlowProvider } from 'reactflow';
import Flow from '../../components/Flow';

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <ReactFlowProvider>
      <Flow flowId={params.id} />
    </ReactFlowProvider>
  );
};

export default Page;
