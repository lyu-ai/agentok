'use client';
import { useProject, useProjects } from '@/hooks';
import { Project } from '@/store/projects';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  RiAddCircleLine,
  RiAddLine,
  RiApps2Line,
  RiArrowDownSLine,
} from 'react-icons/ri';
import { toast } from 'react-toastify';

const ProjectPicker = ({ activeProjectId, className }: any) => {
  const router = useRouter();
  const { projects, createProject, isCreating } = useProjects();
  const { project } = useProject(activeProjectId);
  const [activeProject, setActiveProject] = useState<
    Project | null | undefined
  >(null);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  useEffect(() => {
    setActiveProject(project);
    setAvailableProjects(projects);
  }, [project, projects]);
  const onCreateProject = async () => {
    const newProject = await createProject();
    if (!newProject) {
      toast.error('Failed to create project');
      return;
    }
    toast.success('Project created. Now jumping to project page.');
    router.push(`/projects/${newProject.id}/flow`);
  };
  return (
    <div className="ml-2 flex items-center gap-0.5">
      <Listbox
        value={activeProject}
        onChange={v => router.push(`/projects/${v?.id}/flow`)}
      >
        <ListboxButton
          className={clsx(
            'flex gap-1 items-center bg-base-content/5',
            className
          )}
        >
          <RiApps2Line className="h-4 w-4" />
          <span className="text-ellipsis overflow-hidden whitespace-nowrap hidden lg:block">
            {activeProject?.name}
          </span>
          <RiArrowDownSLine className="h-4 w-4" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="flex flex-col p-2 bg-base-200 dark:bg-gray-700 rounded mt-1 min-w-48 gap-1 shadow dark:border dark:border-gray-600"
        >
          {availableProjects.map(project => (
            <ListboxOption
              key={project.id}
              value={project}
              className="group flex gap-2 text-sm rounded px-4 py-2 data-[selected]:border data-[selected]:border-base-content/20 data-[focus]:bg-base-content/10 cursor-pointer"
            >
              {project.name}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      <button
        onClick={onCreateProject}
        className={clsx(
          'w-8 h-7.5  flex items-center justify-center cursor-pointer',
          className
        )}
        data-tooltip-id="default-tooltip"
        data-tooltip-content="Create Project"
      >
        {!isCreating && <RiAddLine className="w-5 h-5" />}
        {isCreating && <div className="loading loading-primary w-5 h-5" />}
      </button>
    </div>
  );
};

export default ProjectPicker;
