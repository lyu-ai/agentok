'use client';

import { TemplateList } from '@/components/project/template-list';

// standalone means this is not a child of Popover component
export default function Page() {
  return (
    <div className="relative flex flex-col w-full h-full gap-2 p-2 overflow-y-auto">
      <title>Discover | Agentok Studio</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm p-2">
        <span className="text-5xl font-bold p-4">Discover Templates</span>
        <span className="text-lg p-4">
          Select a template to start your project
        </span>
      </div>
      <TemplateList action="project" />
    </div>
  );
}
