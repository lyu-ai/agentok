'use client';
import { Loading } from '@/components/loader';
import { Settings, useSettings, LlmModel } from '@/hooks/use-settings';
import { genId } from '@/lib/id';
import { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible } from '@/components/flow/option/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

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
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span>Model Name</span>
          <Input
            value={model || ''}
            onChange={(e) => setModel(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>API Key</span>
          <Input
            value={apiKey || ''}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span>Description</span>
          <Textarea
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 md:col-span-2">
          <Collapsible
            checked={showAdvanced}
            onChange={() => setShowAdvanced(!showAdvanced)}
          />
          <span>Show Advanced Options</span>
        </label>
        {showAdvanced && (
          <>
            <label className="flex flex-col gap-1">
              <span>Base URL</span>
              <Input
                value={baseUrl || ''}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>API Type (e.g., azure)</span>
              <Input
                value={apiType || ''}
                onChange={(e) => setApiType(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>API Version</span>
              <Input
                value={apiVersion || ''}
                onChange={(e) => setApiVersion(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Tags (Use comma as separater)</span>
              <Input
                value={tags || ''}
                onChange={(e) => setTags(e.target.value)}
              />
            </label>
          </>
        )}
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <Button className="flex items-center gap-2" onClick={handleSave}>
          {isSaving && <div className="loading loading-xs"></div>}
          Save Model
        </Button>
        <Button
          className="flex items-center gap-2"
          variant="destructive"
          onClick={onDelete}
        >
          {isDeleting && <div className="loading loading-xs"></div>}
          Delete Model
        </Button>
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
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.brain className="w-5 h-5" />
          <h1 className="font-bold">Model: {model.model}</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ModelForm
          model={model}
          onSave={handleSave}
          onDelete={handleDelete}
          isSaving={isSaving}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
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
    <ScrollArea className="relative flex flex-col w-full gap-2 text-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold">Models</h1>
          <div>
            Manage the LLM model configurations. The models configured here will
            be shared by all projects.
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-2">
          <Button className="flex items-center gap-2" onClick={onAddModel}>
            {!isCreating && <Icons.brain className="w-4 h-4" />}
            {isCreating && <Icons.spinner className="w-4 h-4 animate-spin" />}
            New Model
          </Button>
        </div>
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
    </ScrollArea>
  );
};

export default Page;
