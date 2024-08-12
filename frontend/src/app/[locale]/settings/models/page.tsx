'use client';
import Loading from '@/components/Loading';
import { Settings, useSettings, LlmModel } from '@/hooks/useSettings';
import { genId } from '@/utils/id';
import { useEffect, useState } from 'react';
import { RiBrainFill } from 'react-icons/ri';

const ModelForm = ({
  model: sourceModel,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: any) => {
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiType, setApiType] = useState('');
  const [apiVersion, setApiVersion] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tags, setTags] = useState('');

  useEffect(() => {
    setModel(sourceModel.model);
    setDescription(sourceModel.description);
    setApiKey(sourceModel.api_key);
    setBaseUrl(sourceModel.base_url);
    setApiType(sourceModel.api_type);
    setApiVersion(sourceModel.api_version);
    setTags(sourceModel.tags);
  }, [sourceModel]);

  const handleSave = () => {
    onSave({
      ...sourceModel,
      model,
      description,
      api_key: apiKey,
      base_url: baseUrl,
      api_type: apiType,
      api_version: apiVersion,
      tags,
    });
  };

  return (
    <div className="p-4 border rounded-lg border-base-content/20 bg-base-content/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span>Model Name</span>
          <input
            className="input input-sm input-bordered rounded"
            value={model || ''}
            onChange={(e) => setModel(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>API Key</span>
          <input
            className="input input-sm input-bordered rounded"
            value={apiKey || ''}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span>Description</span>
          <textarea
            className="textarea textarea-sm textarea-bordered rounded"
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounded"
            checked={showAdvanced}
            onChange={() => setShowAdvanced(!showAdvanced)}
          />
          <span>Show Advanced Options</span>
        </label>
        {showAdvanced && (
          <>
            <label className="flex flex-col gap-1">
              <span>Base URL</span>
              <input
                className="input input-sm input-bordered rounded"
                value={baseUrl || ''}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>API Type (e.g., azure)</span>
              <input
                className="input input-sm input-bordered rounded"
                value={apiType || ''}
                onChange={(e) => setApiType(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>API Version</span>
              <input
                className="input input-sm input-bordered rounded"
                value={apiVersion || ''}
                onChange={(e) => setApiVersion(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Tags (Use comma as separater)</span>
              <input
                className="input input-sm input-bordered rounded"
                value={tags || ''}
                onChange={(e) => setTags(e.target.value)}
              />
            </label>
          </>
        )}
      </div>
      <div className="flex justify-between gap-4 mt-4">
        <button className="btn btn-sm btn-outline" onClick={handleSave}>
          {isSaving && <div className="loading loading-xs"></div>}
          Save Model
        </button>
        <button className="btn btn-sm btn-outline btn-error" onClick={onDelete}>
          {isDeleting && <div className="loading loading-xs"></div>}
          Delete Model
        </button>
      </div>
    </div>
  );
};

const ModelCard = ({ model, onSave, onDelete }: any) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (updatedModel: LlmModel) => {
    setIsSaving(true);
    await onSave(updatedModel);
    setIsSaving(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(model.id);
    setIsDeleting(false);
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2 items-center mb-2">
        <RiBrainFill className="w-5 h-5" />
        <h1 className="font-bold">Model: {model.model}</h1>
      </div>
      <ModelForm
        model={model}
        onSave={handleSave}
        onDelete={handleDelete}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />
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
    setIsCreating(true);
    await updateSettings({
      ...settings,
      models: [
        ...(settings?.models || []),
        {
          id: `llm-${genId()}`,
          model: 'llm-model1',
          description: 'New Model Description',
          api_key: '',
        },
      ],
    });
    setIsCreating(false);
  };

  const handleSaveModel = async (updatedModel: LlmModel) => {
    const newModels = settings?.models?.map((m) =>
      m.id === updatedModel.id ? updatedModel : m
    );
    await updateSettings({
      ...settings,
      models: newModels,
    });
  };

  const handleDeleteModel = async (modelId: string) => {
    const newModels = settings?.models?.filter((m) => m.id !== modelId);
    await updateSettings({
      ...settings,
      models: newModels,
    });
  };

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
          settings.models?.map((model) => (
            <ModelCard
              model={model}
              key={model.id}
              onSave={handleSaveModel}
              onDelete={handleDeleteModel}
            />
          ))
        ) : (
          <div>No models found</div>
        )}
      </div>
    </div>
  );
};

export default Page;
