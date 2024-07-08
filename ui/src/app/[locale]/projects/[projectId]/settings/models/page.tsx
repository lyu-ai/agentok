'use client';
import { useSettings, LlmModel } from '@/hooks/useSettings';
import Link from 'next/link';
import { RiAlertLine } from 'react-icons/ri';

const ModelCard = ({ model }: { model: LlmModel }) => {
  return (
    <div className="flex flex-col p-4 gap-2 border rounded-lg border-base-content/20">
      <h1 className="text-lg font-bold">{model.name}</h1>
      <p>{model.description}</p>
    </div>
  );
};

const Page = () => {
  const { settings, isLoading, isError } = useSettings();
  if (isLoading) {
    return <div>Loading...</div>;
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
      {settings ? (
        <>
          <div className="flex items-center gap-2">Existing Models</div>
          <div className="flex flex-col gap-4">
            {settings.models.map((model: LlmModel) => (
              <ModelCard model={model} key={model.name} />
            ))}
          </div>
        </>
      ) : (
        <div>No models found</div>
      )}
    </div>
  );
};

export default Page;
