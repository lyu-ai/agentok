import { edgeTypes } from '@/lib/flow';
import { nodeTypes } from '@/lib/flow';
import { ReactFlow, useStoreApi } from '@xyflow/react';
import clsx from 'clsx';

export const FlowPreview = ({ template, className }: any) => {
  // Suppress error code 002
  // https://github.com/xyflow/xyflow/issues/3243
  const store = useStoreApi();
  if (process.env.NODE_ENV === 'development') {
    store.getState().onError = (code: string, message: string) => {
      if (code === '002') {
        return;
      }
      console.warn('Workflow warning:', code, message);
    };
  }

  if (!template?.project?.flow?.nodes) return null;

  return (
    <div className={clsx('relative w-full h-full', className)}>
      <ReactFlow
        nodes={template.project.flow.nodes}
        edges={template.project.flow.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      />
      <div className="absolute inset-0 rounded-xl w-full h-full flex items-start justify-center pointer-event-none bg-primary/10"></div>
    </div>
  );
};
