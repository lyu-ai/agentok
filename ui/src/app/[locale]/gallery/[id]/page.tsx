'use client';

import { useTranslations } from 'next-intl';
import { TemplateBlock } from '../../components/TemplateList';
import { useTemplates } from '@/hooks';
import { useEffect, useState } from 'react';
import ReactFlow, { ReactFlowProvider, useStoreApi } from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from '../../utils/flow';
import Markdown from '@/components/Markdown';
import clsx from 'clsx';

const FlowViewer = ({ template, className }: any) => {
  // Suppress error code 002
  // https://github.com/xyflow/xyflow/issues/3243
  const store = useStoreApi();
  if (process.env.NODE_ENV === 'development') {
    store.getState().onError = (code: any, message: any) => {
      if (code === '002') {
        return;
      }
      console.warn('Autoflow warning:', code, message);
    };
  }

  if (!template?.flow?.nodes) return null;

  return (
    <div className={clsx('relative w-full h-full', className)}>
      <ReactFlow
        nodes={template.flow.nodes}
        edges={template.flow.edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      />
      <div className="absolute inset-0 rounded-xl w-full h-full flex items-start justify-center pointer-event-none bg-primary/10"></div>
    </div>
  );
};

const GalleryDetailPage = ({ params }: { params: { id: string } }) => {
  const t = useTranslations('page.Gallery');
  const { templates, isLoading, isError } = useTemplates();
  const [template, setTemplate] = useState<any>();
  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    if (isLoading || !templates) return;
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
    <div className="relative flex flex-col w-full h-full gap-2 p-4 overflow-y-auto items-center">
      <title>Gallery | FlowGen</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm p-2">
        <span className="text-5xl font-bold p-4">{template.name}</span>
        <span className="text-lg p-4 font-normal max-w-5xl">
          <Markdown>{template.description}</Markdown>
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2 text-sm">
        <TemplateBlock
          template={template}
          index={index}
          suppressLink
          className="w-full max-w-sm"
        />
        <ReactFlowProvider key="reactflow-gallery">
          <FlowViewer
            template={template}
            className="max-w-2xl min-h-[420px] bg-base-content/10 border border-base-content/5 rounded-xl"
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default GalleryDetailPage;
