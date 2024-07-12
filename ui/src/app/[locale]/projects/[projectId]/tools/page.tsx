'use client'; // Ensures this file is treated as a client component
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ToolDetail from './components/Detail';
import ToolBlock from './components/Block';
import { genId } from '@/utils/id';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';
import { useProject } from '@/hooks';
import { RiAddFill, RiFormula } from 'react-icons/ri';
import { Tool } from '@/store/projects';

const Page = ({ params }: { params: { projectId: string } }) => {
  const t = useTranslations('tool.Config');
  const { project, updateProject } = useProject(params.projectId);
  const [selectedTool, setSelectedTool] = useState(-1);
  const [isCreating, setIsCreating] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    console.log(project?.tools, selectedTool);
    if (project?.tools && project?.tools.length > 0) {
      setTools(project.tools);
      setSelectedTool(0);
    }
  }, [project]);

  const onAdd = async () => {
    setIsCreating(true);
    await updateProject({
      tools: [
        {
          id: 'tool-' + genId(),
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
        ...tools,
      ],
    }).finally(() => setIsCreating(false));
    setSelectedTool(0); // select the new added tool
  };

  const onDelete = async (tool: any) => {
    const updatedTools = tools.filter((t: any) => t.id !== tool.id) ?? [];
    await updateProject({ tools: updatedTools });
    if (selectedTool > updatedTools.length - 1)
      setSelectedTool(updatedTools.length - 1); // either select the last one or -1
  };

  return (
    <div className={clsx('flex w-full h-full')}>
      <div className="flex flex-col w-80 h-full border-r p-2 gap-2 border-base-content/10">
        <button className="btn btn-sm btn-primary" onClick={onAdd}>
          {isCreating ? (
            <div className="loading loading-xs" />
          ) : (
            <RiAddFill className="w-5 h-5" />
          )}
          <span>{t('new-tool')}</span>
        </button>
        <div className="flex flex-col gap-2 w-full h-full overflow-y-hidden">
          {tools.length > 0 ? (
            tools.map((tool: any, index: any) => (
              <ToolBlock
                selected={selectedTool === index}
                tool={tool}
                key={index}
                onDelete={() => onDelete(tool)}
                onClick={() => setSelectedTool(index)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-base-content/50">
              {t('no-tools')}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-2 flex-grow h-full overflow-y-auto">
        {selectedTool === -1 ? (
          <div className="flex flex-col w-full h-full items-center justify-center flex-grow text-base-content/50">
            <div className="flex flex-col items-center gap-3 max-w-2xl text-center">
              <RiFormula className="w-16 h-16" />
              {t('tool-prompt')}
            </div>
          </div>
        ) : (
          <ToolDetail
            projectId={params.projectId}
            tool={project?.tools?.[selectedTool]}
          />
        )}
      </div>
      <Tooltip id="tool-tooltip" place="bottom" />
    </div>
  );
};

export default Page;
