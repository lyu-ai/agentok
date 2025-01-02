'use client';

import { TemplateCard } from '@/components/project/template-list';
import { useTemplates } from '@/hooks';
import { use, useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Markdown from '@/components/markdown';
import { FlowPreview } from '@/components/flow/flow-preview';
const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { templates, isLoading, isError } = useTemplates();
  const [template, setTemplate] = useState<any>();
  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    if (isLoading || !templates) return;
    if (id) {
      const intId = parseInt(id, 10);
      const index = templates.findIndex(
        (template: any) => template.id === intId
      );
      if (index >= 0) {
        setTemplate(templates[index]);
        setIndex(index);
      }
    }
  }, [id, templates, isLoading]);

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
      <title>Template | Agentok Studio</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm p-2">
        <span className="text-5xl font-bold p-4">{template.name}</span>
        <span className="text-lg p-4 font-normal max-w-5xl">
          <Markdown>{template.description}</Markdown>
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2 text-sm">
        <TemplateCard
          template={template}
          index={index}
          suppressLink
          className="w-full max-w-sm"
        />
        <ReactFlowProvider key="reactflow-template">
          <FlowPreview
            template={template}
            className="max-w-2xl min-h-[420px] bg-base-content/10 border border-base-content/5 rounded-xl"
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Page;
