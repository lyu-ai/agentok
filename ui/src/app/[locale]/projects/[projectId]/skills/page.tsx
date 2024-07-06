'use client';
import clsx from 'clsx';
import { TbFunction } from 'react-icons/tb';
import { useEffect, useState } from 'react';
import SkillDetail from './components/Detail';
import SkillBlock from './components/Block';
import { genId } from '@/utils/id';
import { MdOutlineAdd } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';
import { useProject } from '@/hooks';

const Page = ({ params }: { params: { projectId: string } }) => {
  const t = useTranslations('skill.Config');
  const { project, updateProject } = useProject(params.projectId);
  const [selectedSkill, setSelectedSkill] = useState(-1);
  useEffect(() => {
    if (project?.skills?.length > 0 && selectedSkill === -1)
      setSelectedSkill(0);
  }, [project?.skills?.length, selectedSkill, setSelectedSkill]);
  const onAdd = () => {
    updateProject({
      skills: [
        {
          id: 'skill-' + genId(),
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
        ...(project?.skills || []),
      ],
    });
    setSelectedSkill(0); // select the new added skill
  };
  const onDelete = (func: any) => {
    const updatedSkills = project?.skills?.filter((f: any) => f.id !== func.id);
    updateProject({ skills: updatedSkills });
    if (selectedSkill > updatedSkills.length - 1)
      setSelectedSkill(selectedSkill - 1); // either select the last one or -1
  };
  return (
    <div className={clsx('flex w-full h-full')}>
      <div className="flex flex-col w-80 h-full border-r p-2 gap-2 border-base-content/10">
        <button className="btn btn-primary" onClick={onAdd}>
          <MdOutlineAdd className="w-5 h-5" />
          <span>{t('new-skill')}</span>
        </button>
        <div className="flex flex-col gap-2 w-full h-full overflow-y-hidden">
          {project?.skills?.map((func: any, index: any) => (
            <SkillBlock
              selected={selectedSkill === index}
              func={func}
              key={index}
              onDelete={() => onDelete(func)}
              onClick={() => setSelectedSkill(index)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-2 flex-grow h-full overflow-y-auto">
        {selectedSkill === -1 ? (
          <div className="flex flex-col w-full h-full items-center justify-center flex-grow text-base-content/50">
            <div className="flex flex-col items-center gap-3 max-w-2xl text-center">
              <TbFunction className="w-16 h-16" />
              {t('skill-prompt')}
            </div>
          </div>
        ) : (
          <SkillDetail
            projectId={params.projectId}
            skill={project?.skills?.[selectedSkill]}
          />
        )}
      </div>
      <Tooltip id="func-tooltip" place="bottom" />
    </div>
  );
};

export default Page;
