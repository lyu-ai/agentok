'use client';
import { useSettings, LlmModel } from '@/hooks/useSettings';
import { useState } from 'react';
import { RiBrainFill } from 'react-icons/ri';

const ModelCard = ({ model }: { model: LlmModel }) => {
  const { settings, updateSettings } = useSettings();
  const [name, setName] = useState(model.name || '');
  const [description, setDescription] = useState(model.description || '');
  const [apiKey, setApiKey] = useState(model.apiKey || '');
  const [baseUrl, setBaseUrl] = useState(model.baseUrl || '');
  const [apiVersion, setApiVersion] = useState(model.apiVersion || '');
  const [expanded, setExpanded] = useState(true);

  const onSave = () => {
    const updatedModel = {
      ...model,
      name,
      description,
      apiKey,
      baseUrl,
      apiVersion,
    };

    const newModels = settings?.models?.map((m: LlmModel) =>
      m.name === model.name ? updatedModel : m
    );

    updateSettings({
      ...settings,
      models: newModels,
    } as any);
  };

  return (
    <div className="collapse collapse-arrow border rounded-lg border-base-content/20 bg-base-content/20">
      <input
        type="checkbox"
        checked={expanded}
        onChange={v => setExpanded(v.target.checked)}
        className="peer"
      />
      <div className="collapse-title flex gap-2 items-center">
        <RiBrainFill className="w-5 h-5" />
        <h1 className="font-bold">Model: {name}</h1>
      </div>
      <div className="collapse-content">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span>Name</span>
            <input
              className="input input-sm input-bordered rounded"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>API Key</span>
            <input
              className="input input-sm input-bordered rounded"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 col-span-2">
            <span>Description</span>
            <textarea
              className="textarea textarea-sm textarea-bordered rounded"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Base URL</span>
            <input
              className="input input-sm input-bordered rounded"
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>API Version</span>
            <input
              className="input input-sm input-bordered rounded"
              value={apiVersion}
              onChange={e => setApiVersion(e.target.value)}
            />
          </label>
        </div>
        <button className="btn btn-sm btn-outline mt-4" onClick={onSave}>
          Save Model
        </button>
      </div>
    </div>
  );
};

const Page = () => {
  const { settings, isLoading, isError, updateSettings } = useSettings();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading settings</div>;
  }
  const onAddModel = () => {
    // Add your add model logic here
    console.log('Add model');
    updateSettings({
      ...settings,
      models: [
        ...(settings?.models || []),
        {
          name: 'llm-model1',
          description: 'New Model Description',
          apiKey: 'Please input your api-key here',
        },
      ],
    } as any);
  };
  return (
    <div className="flex flex-col w-full gap-2 text-sm">
      <h1 className="text-lg font-bold">Models</h1>
      <div>
        Manage the LLM model configurations. The models configured here will be
        shared by all projects.
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-sm btn-primary" onClick={onAddModel}>
          Add Model
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {settings ? (
          settings.models?.map((model: LlmModel, index: number) => (
            <ModelCard model={model} key={index} />
          ))
        ) : (
          <div>No models found</div>
        )}
      </div>
    </div>
  );
};

export default Page;
