'use client';

import { ReactFlowProvider } from 'reactflow';
import Flow from '../components/Flow';

const Page = ({ params }: { params: { id: string[] } }) => {
  if (Array.isArray(params.id) && params.id.length > 1) {
    return <div>Invalid param: {params.id}</div>;
  }

  return (
    <div className="flex-1 w-full overflow-y-auto">
      <title>Flowgen | Penless Lab</title>
      <ReactFlowProvider>
        <Flow flowId={params.id?.[0]} />
      </ReactFlowProvider>
    </div>
  );
};

export default Page;
