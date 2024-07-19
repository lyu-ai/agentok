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
import { RiAddLine, RiApps2Line, RiArrowDownSLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { Node, Edge } from 'reactflow';

export const initialNodes: Node[] = [
  {
    id: '1001',
    type: 'initializer',
    data: {
      name: 'Initializer',
      label: 'initializer',
      class: 'Initializer',
      sample_messages: [
        'Write a poem based on recent headlines about Vancouver.',
      ],
    },
    position: { x: -133, y: 246 },
  },
  {
    id: '1',
    type: 'user',
    data: {
      name: 'User',
      label: 'user',
      class: 'UserProxyAgent',
      human_input_mode: 'NEVER',
      termination_msg: 'TERMINATE',
      enable_code_execution: true,
      max_consecutive_auto_reply: 10,
    },
    position: { x: 271, y: 222 },
  },
  {
    id: '2',
    type: 'assistant',
    data: {
      name: 'Assistant',
      type: 'assistant',
      label: 'assistant',
      class: 'AssistantAgent',
      max_consecutive_auto_reply: 10,
    },
    position: { x: 811, y: 216 },
  },
  {
    id: '998',
    type: 'note',
    data: {
      name: 'Note',
      label: 'note',
      class: 'Note',
      content:
        'Click **Start Chat** to show the chat pane, and in chat pane, select a sample question to start the conversation.',
    },
    position: { x: 87, y: 740 },
  },
];

export const initialEdges: Edge[] = [
  {
    id: '1001-1',
    source: '1001',
    target: '1',
  },
  {
    id: '1-2',
    source: '1',
    target: '2',
    animated: true,
    type: 'converse',
  },
];
const ProjectPicker = ({ activeProjectId, className }: any) => {
  const router = useRouter();
  const { projects, createProject, isCreating, updateProject } = useProjects();
  const { project } = useProject(activeProjectId);
  const [activeProject, setActiveProject] = useState<Project | undefined>(
    undefined
  );
  useEffect(() => {
    setActiveProject(project);
  }, [project]);

  const onCreateProject = async () => {
    const newProject = await createProject({
      id: -1, // Will be replaced by actual id from server side
      name: 'New Project',
      description: 'A new project with sample flow.',
      flow: {
        nodes: initialNodes,
        edges: initialEdges,
      },
    });
    if (!newProject) {
      toast.error('Failed to create project');
      return;
    }
    // Initialize the project with sample workflow
    await updateProject(newProject.id, {
      flow: JSON.stringify({
        nodes: initialNodes,
        edges: initialEdges,
      }),
    });

    toast.success('Project created. Now jumping to project page.');
    router.push(`/projects/${newProject.id}/flow`);
  };

  return (
    <div className="ml-2 flex items-center gap-0.5 z-40">
      <Listbox
        value={activeProject || { id: -1, name: 'Select Project' }}
        onChange={v => router.push(`/projects/${v?.id}/flow`)}
      >
        <ListboxButton
          className={clsx(
            'flex gap-1 items-center bg-base-content/5',
            className
          )}
        >
          <RiApps2Line className="h-4 w-4" />
          <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-24">
            {activeProject?.name || 'Select Project'}
          </span>
          <RiArrowDownSLine className="h-4 w-4" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="flex flex-col p-2 bg-base-200 dark:bg-gray-700 rounded mt-1 min-w-48 gap-1 shadow dark:border dark:border-gray-600"
        >
          {projects.length > 0 &&
            projects.map(project => (
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
