'use client'; // Ensures this file is treated as a client component
import clsx from 'clsx';
import { PropsWithChildren, useEffect, useState } from 'react';
import ToolCard from './components/ToolCard';
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
  const t = useTranslations('tool.Config');
  const { project, updateProject } = useProject(projectId);
  const [isCreating, setIsCreating] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    if (project?.tools && project?.tools.length > 0) {
      setTools(project.tools);
    }
  }, [project]);

  const onAdd = async () => {
    setIsCreating(true);
    await updateProject({
      tools: [
        {
          id: genId(),
          name: 'hello',
          description: 'Send hello world message.',
          code: '',
          parameters: [
            {
              id: genId(),
              name: 'message',
              type: 'str',
              description: 'The message to be printed.',
            },
          ],
        },
        ...tools,
      ],
    }).finally(() => setIsCreating(false));
  };

  const onDelete = async (tool: any) => {
    const updatedTools = tools.filter((t: any) => t.id !== tool.id) ?? [];
    await updateProject({ tools: updatedTools });
  };

  const onSelect = async (tool: any) => {
    router.push(`/projects/${params.projectId}/tools/${tool.id}`);
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
            <span>{t('new-tool')}</span>
          </button>
          <Link
            href={`/projects/${params.projectId}/tools`}
            className="btn btn-sm btn-primary btn-square"
            data-tooltip-id="default-tooltip"
            data-tooltip-content={'Shared Tools'}
          >
            <RiLayoutGridFill className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex flex-col gap-2 w-full h-full overflow-y-hidden">
          {tools.length > 0 ? (
            tools.map((tool: any, index: any) => {
              const isSelected = pathname.includes(`/tools/${tool.id}`);
              return (
                <ToolCard
                  selected={isSelected}
                  tool={tool}
                  key={index}
                  onDelete={() => onDelete(tool)}
                  onClick={() => onSelect(tool)}
                />
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-base-content/50">
              {t('no-tools')}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-2 flex-grow h-full overflow-y-auto">
        {children}
      </div>
      <Tooltip id="tool-tooltip" place="bottom" />
    </div>
  );
};

export default Layout;
