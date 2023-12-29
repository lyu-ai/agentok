'use client';

import { useTranslations } from 'next-intl';
import { TemplateBlock } from '../../components/TemplateList';
import { useTemplates } from '@/hooks';
import { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import { nodeTypes } from '../../utils/flow';

const FlowViewer = ({ template, className }: any) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (!template?.flow) return;
    setNodes(template.flow.nodes ?? []);
    setEdges(template.flow.edges ?? []);
    fitView({ padding: 0.1 });
  }, [template?.flow?.nodes, template?.flow?.edges, fitView]);

  console.log('nodes:', template.flow.nodes);

  // Suppress error code 002
  // https://github.com/xyflow/xyflow/issues/3243
  const store = useStoreApi();
  if (process.env.NODE_ENV === 'development') {
    store.getState().onError = (code, message) => {
      if (code === '002') {
        return;
      }
      console.warn('Flow warning:', code, message);
    };
  }

  return (
    <ReactFlow
      nodes={template?.flow?.nodes}
      edges={template?.flow?.edges}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      className={className}
    >
      <Background
        id="logo"
        gap={32}
        color="hsl(var(--sc))"
        className="engraved-bg bg-no-repeat bg-center bg-[url('/logo-bg.svg')]"
        style={{ backgroundSize: '80px' }}
      />
    </ReactFlow>
  );
};

// standalone means this is not a child of Popover component
const GalleryDetailPage = ({ params }: { params: { id: string } }) => {
  const t = useTranslations('page.Gallery');
  const { templates, isLoading, isError } = useTemplates();
  const [template, setTemplate] = useState<any>();
  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    if (isLoading) return;
    if (params?.id) {
      const index = templates.findIndex(
        (template: any) => template.id === params.id
      );
      if (index >= 0) {
        setTemplate(templates[index]);
        setIndex(index);
      }
    }
  }, [params?.id, templates, isLoading]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <div className="loading loading-bars text-primary" />
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        {isError}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full h-full gap-2 p-2 overflow-y-auto items-center">
      <title>Gallery | FlowGen</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm font-bold p-2">
        <span className="text-5xl font-bold p-4">{template.name}</span>
        <span className="text-lg p-4 font-normal">{template.description}</span>
      </div>
      <div className="flex items-center justify-center w-full gap-2 text-sm font-bold">
        <TemplateBlock template={template} index={index} suppressLink />
        <ReactFlowProvider>
          <FlowViewer
            template={template}
            className="w-full max-w-2xl h-full bg-base-content/10 border border-base-content/5 rounded-xl"
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default GalleryDetailPage;
