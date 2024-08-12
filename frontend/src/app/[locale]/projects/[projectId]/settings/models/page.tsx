'use client';
import Loading from '@/components/Loading';
import { useSettings, LlmModel, useProjectSettings } from '@/hooks/useSettings';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RiAlertLine } from 'react-icons/ri';

const ModelCard = ({ model }: { model: LlmModel }) => {
  return (
    <div className="flex flex-col p-4 gap-2 border rounded-lg border-base-content/20">
      <h1 className="text-lg font-bold">{model.model}</h1>
      <p>{model.description}</p>
    </div>
  );
};

const Page = ({ params }: { params: { projectId: string } }) => {
  const projectId = parseInt(params.projectId, 10);
  const { settings, isLoading, isError, updateSettings } =
    useProjectSettings(projectId);
  const { settings: globalSettings } = useSettings();
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.filters) {
      setFilters(settings.filters);
    }
  }, [settings?.filters]);

  const onFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };
  const onFilterBlur = async () => {
    setIsSaving(true);
    await updateSettings({
      ...settings,
      filters: filters,
    });
    setIsSaving(false);
  };

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <div>Error loading settings</div>;
  }
  return (
    <div className="flex flex-col w-full gap-4 text-sm">
      <h1 className="text-lg font-bold">Project Models</h1>
      <div className="flex flex-col gap-4 border rounded-lg p-4 border-warning text-warning bg-warning/20">
        <RiAlertLine className="w-12 h-12" />
        <p>
          Project-level models are not yet supported. Please configure models in{' '}
          <span>
            <Link href="/settings/models" className="link-primary link">
              Account Settings
            </Link>
          </span>
          , which will be shared by all projects.
        </p>
      </div>
      <h1 className="text-lg font-bold">Filters</h1>
      <div>
        The provided list of LLM models might be too long to use. Here we can
        use filters to focus on the models we are interested in.
      </div>
      <div className="flex flex-col gap-2">
        <div className="font-bold">
          Filter by model names (use comma to separate)
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="gpt4,gpt-3.5"
            value={filters?.name || ''}
            onChange={(e) => onFilterChange('name', e.target.value)}
            onBlur={onFilterBlur}
            className="input input-sm rounded min-w-2xl"
          />
          {isSaving && <div className="loading loading-xs" />}
        </div>
      </div>
      <>
        <div className="text-lg font-bold">Global Models</div>
        <div>
          These models are created in{' '}
          <span>
            <Link href="/settings/models" className="link-primary link">
              Account Settings
            </Link>
          </span>
          , and shared across all projects.
        </div>
        <div className="flex flex-col gap-4">
          {globalSettings?.models ? (
            globalSettings.models.map((model: LlmModel) => (
              <ModelCard model={model} key={model.model} />
            ))
          ) : (
            <div>
              No global models found. The builtin model list will be used.
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default Page;
