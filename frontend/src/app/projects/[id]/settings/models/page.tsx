'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useProject } from '@/hooks';
import { GenericOption } from '@/components/flow/option/option';

export default function ModelsPage() {
  const params = useParams();
  const projectId = params?.id ? parseInt(params.id as string) : -1;
  const { project, updateProject } = useProject(projectId);

  const handleChange = (key: string, value: any) => {
    updateProject({
      settings: {
        ...project?.settings,
        [key]: value,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-lg font-bold">Model Settings</div>
      <div className="flex flex-col gap-4">
        <GenericOption
          type="select"
          nodeId={projectId.toString()}
          data={project?.settings ?? {}}
          name="model"
          label="Default Model"
          options={[
            { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
            { value: 'gpt-4', label: 'GPT-4' },
            { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
          ]}
          onChange={(value) => handleChange('model', value)}
        />
        <GenericOption
          type="text"
          nodeId={projectId.toString()}
          data={project?.settings ?? {}}
          name="api_key"
          label="OpenAI API Key"
          placeholder="Enter your OpenAI API key..."
          onChange={(value) => handleChange('api_key', value)}
        />
        <GenericOption
          type="text"
          nodeId={projectId.toString()}
          data={project?.settings ?? {}}
          name="api_base"
          label="OpenAI API Base"
          placeholder="Enter your OpenAI API base URL..."
          onChange={(value) => handleChange('api_base', value)}
        />
      </div>
    </div>
  );
}
