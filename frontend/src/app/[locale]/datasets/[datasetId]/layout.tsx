'use client'; // Ensures this file is treated as a client component
import clsx from 'clsx';
import { PropsWithChildren, useEffect, useState } from 'react';
import DatasetCard from '../components/DatasetCard';
import { usePathname, useRouter } from 'next/navigation';
import { genId } from '@/utils/id';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';
import { useProject } from '@/hooks';
import {
  RiBriefcase4Fill,
  RiBriefcase4Line,
  RiLayoutGridFill,
} from 'react-icons/ri';
import { Tool } from '@/store/projects';
import Link from 'next/link';

const Layout = ({
  children,
  params,
}: PropsWithChildren<{ params: { projectId: string } }>) => {
  const projectId = parseInt(params.projectId, 10);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('page.Datasets');
  const { project, updateProject } = useProject(projectId);
  const [isCreating, setIsCreating] = useState(false);
  const [datasets, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    if (project?.datasets && project?.datasets.length > 0) {
      setTools(project.datasets);
    }
  }, [project]);

  const onAdd = async () => {
    setIsCreating(true);
    await updateProject({
      datasets: [
        {
          id: 't' + genId(),
          name: 'hello',
          description: 'Print hello world message.',
          code: '',
          parameters: [
            {
              id: 'param-' + genId(),
              name: 'message',
              type: 'str',
              description: 'The message to be printed.',
            },
          ],
        },
        ...datasets,
      ],
    }).finally(() => setIsCreating(false));
  };

  const onDelete = async (dataset: any) => {
    const updatedTools = datasets.filter((t: any) => t.id !== dataset.id) ?? [];
    await updateProject({ datasets: updatedTools });
  };

  const onSelect = async (dataset: any) => {
    router.push(`/projects/${params.projectId}/datasets/${dataset.id}`);
  };

  return (
    <div className={clsx('flex w-full h-full')}>
      <div className="flex flex-col w-80 h-full border-r p-2 gap-2 border-base-content/10">
        <div className="flex items-center gap-1">
          <button
            className="btn btn-sm btn-primary flex flex-1"
            onClick={onAdd}
          >
            {isCreating ? (
              <div className="loading loading-xs" />
            ) : (
              <RiBriefcase4Line className="w-4 h-4" />
            )}
            <span>{t('new-dataset')}</span>
          </button>
          <Link
            href={`/projects/${params.projectId}/datasets`}
            className="btn btn-sm btn-primary btn-square"
            data-datasettip-id="default-datasettip"
            data-datasettip-content={'Shared Tools'}
          >
            <RiLayoutGridFill className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex flex-col gap-2 w-full h-full overflow-y-hidden">
          {datasets.length > 0 ? (
            datasets.map((dataset: any, index: any) => {
              const isSelected = pathname.includes(`/datasets/${dataset.id}`);
              return (
                <DatasetCard
                  selected={isSelected}
                  dataset={dataset}
                  key={index}
                  onDelete={() => onDelete(dataset)}
                  onClick={() => onSelect(dataset)}
                />
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-base-content/50">
              {t('no-datasets')}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-2 flex-grow h-full overflow-y-auto">
        {children}
      </div>
      <Tooltip id="dataset-datasettip" place="bottom" />
    </div>
  );
};

export default Layout;
