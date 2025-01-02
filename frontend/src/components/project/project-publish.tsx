import { PopupDialog } from '@/components/popup-dialog';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProject, useTemplates } from '@/hooks';
import { Loading } from '@/components/loading';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';

export const ProjectPublish = ({ projectId, className, ...props }: any) => {
  const { project, isLoading } = useProject(projectId);
  const { publishTemplate, isPublishing } = useTemplates();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description ?? '');
    }
  }, [project]);

  if (isLoading || !project) {
    return <Loading />;
  }

  const onPublishProject = async () => {
    await publishTemplate({
      name,
      description,
      project,
    })
      .then((template) => {
        toast({
          title: 'Publish success',
          description: `Publish success, ${project.name}`,
        });
        router.push(`/discover/${template.id}`);
      })
      .catch(() => {
        toast({
          title: 'Publish failed',
          description: `Publish failed, ${project.name}`,
        });
      });
  };

  return (
    <PopupDialog
      title={
        <div className="flex items-center gap-2">
          <Icons.share className="w-5 h-5" />
          <span className="text-md font-bold">Publish</span>
        </div>
      }
      className={clsx(
        'flex flex-col bg-gray-800/80 backgrop-blur-md border border-gray-700 shadow-box-lg shadow-gray-700',
        className
      )}
      classNameTitle="border-b border-base-content/10"
      classNameBody="flex flex-grow flex-col w-full h-full min-w-2xl p-4 gap-2 text-sm overflow-y-auto"
      {...props}
    >
      <span className="py-4">
        Publish your project to the world
      </span>
      <div className="divider my-0" />
      <div className="flex items-center gap-2">
        <span className="py-4">Project name</span>
        <input
          className="input input-bordered input-sm p-1 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <span>Project description</span>
        <textarea
          rows={4}
          className="textarea textarea-bordered textarea-sm rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-end mt-4">
        <button
          className="btn btn-sm btn-primary rounded px-4"
          onClick={onPublishProject}
        >
          {!isPublishing && <Icons.share className="w-4 h-4" />}
          {isPublishing && <div className="loading loading-xs" />}
          Publish
        </button>
      </div>
    </PopupDialog>
  );
};
