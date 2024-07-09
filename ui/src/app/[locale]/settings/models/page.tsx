'use client';
import Loading from '@/components/Loading';
import { Settings, useSettings, LlmModel } from '@/hooks/useSettings';
import { genId } from '@/utils/id';
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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onSave = async () => {
    setIsSaving(true);
    const updatedModel = {
      ...model,
      name,
      description,
      apiKey,
      baseUrl,
      apiVersion,
    };

    const newModels = settings?.models?.map((m: LlmModel) =>
      m.id === model.id ? updatedModel : m
    );

    await updateSettings({
      ...settings,
      models: newModels,
    });
    setIsSaving(false);
  };

  const onDelete = async () => {
    setIsDeleting(true);
    const newModels = settings?.models?.filter(
      (m: LlmModel) => m.id !== model.id
    );

    await updateSettings({
      ...settings,
      models: newModels,
    });
    setIsDeleting(false);
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
        <div className="flex justify-between gap-4 mt-4">
          <button className="btn btn-sm btn-outline" onClick={onSave}>
            {isSaving && <div className="loading loading-xs"></div>}
            Save Model
          </button>
          <button
            className="btn btn-sm btn-outline btn-error"
            onClick={onDelete}
          >
            {isDeleting && <div className="loading loading-xs"></div>}
            Delete Model
          </button>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const { settings, isLoading, isError, updateSettings } = useSettings();
  const [isCreating, setIsCreating] = useState(false);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <div>Error loading settings</div>;
  }
  const onAddModel = async () => {
    // Add your add model logic here
    console.log('Add model');
    setIsCreating(true);
    await updateSettings({
      ...settings,
      models: [
        ...(settings?.models || []),
        {
          id: `llm-${genId()}`, // Add a unique id here, e.g. `genId()
          name: 'llm-model1',
          description: 'New Model Description',
          apiKey: 'Please input your api-key here',
        },
      ],
    });
    setIsCreating(false);
  };
  console.log(settings);
  return (
    <div className="flex flex-col w-full gap-2 text-sm">
      <h1 className="text-lg font-bold">Models</h1>
      <div>
        Manage the LLM model configurations. The models configured here will be
        shared by all projects.
      </div>
      <div className="flex items-center justify-end gap-2">
        <button className="btn btn-sm btn-primary" onClick={onAddModel}>
          {!isCreating && <RiBrainFill className="w-4 h-4" />}
          {isCreating && <div className="loading loading-xs"></div>}
          New Model
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {settings ? (
          settings.models?.map((model: LlmModel, index: number) => (
            <ModelCard model={model} key={model.id} />
          ))
        ) : (
          <div>No models found</div>
        )}
      </div>
    </div>
  );
};

export default Page;
