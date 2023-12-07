'use client';

import { ReactFlowProvider } from 'reactflow';
import Flow from '../components/Flow';
import { Tooltip } from 'react-tooltip';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = ({ params }: { params: { id: string[] } }) => {

  if (Array.isArray(params.id) && params.id.length > 1) {
    return <div>Invalid param: {params.id}</div>;
  }

  return (
    <div className="flex-1 w-full overflow-y-auto">
      <title>FlowGen</title>
      <ReactFlowProvider>
        <Flow flowId={params.id?.[0]} />
      </ReactFlowProvider>
      <ToastContainer
          position="bottom-right"
          theme="colored"
          hideProgressBar
        />
        <Tooltip
          id="default-tooltip"
          className="bg-base-100 text-base-content"
          place="bottom"
        />
        <Tooltip
          id="html-tooltip"
          classNameArrow="html-tooltip-arrow bg-gray-700 border-r border-b border-gray-500"
          className="!bg-gray-600 !border !border-gray-500 !text-gray-200 !px-2 !py-1"
          style={{ maxWidth: '300px', zIndex: 9999 }}
          clickable
        />
    </div>
  );
};

export default Page;
