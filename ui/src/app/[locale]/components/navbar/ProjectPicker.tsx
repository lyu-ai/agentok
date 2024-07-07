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
import { RiApps2Line, RiArrowDownSLine } from 'react-icons/ri';

const ProjectPicker = ({ activeProjectId, className }: any) => {
  const router = useRouter();
  const { projects } = useProjects();
  const { project } = useProject(activeProjectId);
  const [activeProject, setActiveProject] = useState<
    Project | null | undefined
  >(null);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  useEffect(() => {
    setActiveProject(project);
    setAvailableProjects(projects);
  }, [project, projects]);
  return (
    <Listbox
      value={activeProject}
      onChange={v => router.push(`/projects/${v?.id}/flow`)}
    >
      <ListboxButton
        className={clsx(
          'ml-2 flex gap-1 items-center bg-base-content/5',
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
  );
};

export default ProjectPicker;
