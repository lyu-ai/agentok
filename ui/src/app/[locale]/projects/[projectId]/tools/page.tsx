'use client';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ToolDetail from './components/Detail';
import ToolBlock from './components/Block';
import { genId } from '@/utils/id';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';
import { useProject } from '@/hooks';
import { RiAddFill, RiFormula } from 'react-icons/ri';

const Page = ({ params }: { params: { projectId: string } }) => {
  const t = useTranslations('tool.Config');
  const { project, updateProject } = useProject(params.projectId);
  const [selectedTool, setSelectedTool] = useState(-1);
  useEffect(() => {
    if (project?.tools?.length > 0 && selectedTool === -1) setSelectedTool(0);
  }, [project?.tools?.length, selectedTool, setSelectedTool]);
  const onAdd = () => {
    updateProject({
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
              type: 'string',
              description: 'The message to be printed.',
            },
          ],
        },
        ...(project?.tools || []),
      ],
    });
    setSelectedTool(0); // select the new added tool
  };
  const onDelete = (func: any) => {
    const updatedTools = project?.tools?.filter((f: any) => f.id !== func.id);
    updateProject({ tools: updatedTools });
    if (selectedTool > updatedTools.length - 1)
      setSelectedTool(selectedTool - 1); // either select the last one or -1
  };
  return (
    <div className={clsx('flex w-full h-full')}>
      <div className="flex flex-col w-80 h-full border-r p-2 gap-2 border-base-content/10">
        <button className="btn btn-sm btn-primary" onClick={onAdd}>
          <RiAddFill className="w-5 h-5" />
          <span>{t('new-tool')}</span>
        </button>
        <div className="flex flex-col gap-2 w-full h-full overflow-y-hidden">
          {project?.tools?.map((func: any, index: any) => (
            <ToolBlock
              selected={selectedTool === index}
              func={func}
              key={index}
              onDelete={() => onDelete(func)}
              onClick={() => setSelectedTool(index)}
            />
          ))}
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
      <Tooltip id="func-tooltip" place="bottom" />
    </div>
  );
};

export default Page;
