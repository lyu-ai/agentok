import React, { useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PopupDialog from '@/components/PopupDialog';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useProjectId } from '@/context/ProjectContext';
import { useProject } from '@/hooks';
import { Tool } from '@/store/projects';
import {
  RiCloseLine,
  RiDraggable,
  RiSettings3Line,
  RiToolsLine,
} from 'react-icons/ri';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';
import GenericOption from '../option/Option';
import Tip from '@/components/Tip';
import Link from 'next/link';

const ItemType = {
  TOOL: 'tool',
};

const AvailableTool = ({ tool }: any) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TOOL,
    item: { id: tool.id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className={clsx(
        'group flex items-center justify-between gap-2 p-2 border bg-base-content/10 border-base-content/40 rounded cursor-move',
        {
          'border-primary': isDragging,
        }
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="font-bold">
          {tool.name} {isDragging ? '👋' : ''}
        </div>
        <div className="text-xs line-clamp-1">{tool.description}</div>
      </div>
      <RiDraggable className="shrink-0" />
    </div>
  );
};

const AssignedTool = ({ scene, tool, onRemove }: any) => {
  return (
    <div className="relative group flex w-48 h-16 items-center justify-between gap-1 p-2 bg-base-content/20 border border-base-content/40 rounded">
      <div className="flex flex-col gap-1">
        <div className="font-bold">{tool.name}</div>
        <div className="text-xs line-clamp-1">{tool.description}</div>
      </div>
      <button
        onClick={() => onRemove(tool.id, scene)}
        className="absolute right-1 top-1 rounded-full group-hover:text-error"
      >
        <RiCloseLine className="w-4 h-4" />
      </button>
    </div>
  );
};

const DropZone = ({ onDrop, placeholder, children }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TOOL,
    drop: (item: { id: string }, monitor) => {
      console.log('dropping', item, monitor.getDropResult());
      if (monitor.didDrop()) {
        return;
      }
      onDrop(item.id);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className={clsx(
        'flex w-full min-h-32 flex-wrap gap-1 p-1 border border-dashed border-primary/20 rounded',
        {
          'bg-gray-600': isOver,
        }
      )}
    >
      {children || (
        <div className="flex w-full h-full justify-center items-center">
          {placeholder}
        </div>
      )}
    </div>
  );
};

const ConversableAgentConfig = ({ nodeId, data, className, ...props }: any) => {
  const t = useTranslations('option.ConversableAgentConfig');
  const tGeneric = useTranslations('node.Generic');
  const { projectId } = useProjectId();
  const { project, updateProject } = useProject(projectId);

  const handleDrop = async (toolId: string, scene: 'execution' | 'llm') => {
    if (!project) {
      return;
    }
    let originalTools = project.tools ?? [];
    // Handle the drop logic here
    await updateProject({
      tools: [
        ...originalTools.map(tool => {
          if (
            tool.id === toolId &&
            !tool.assigned?.find(a => a.agent === nodeId && a.scene === scene)
          ) {
            return {
              ...tool,
              assigned: [
                ...(tool.assigned || []),
                { agent: nodeId as string, scene },
              ],
            } as Tool;
          }
          return tool;
        }),
      ],
    });
  };

  const handleRemove = async (toolId: string, scene: 'execution' | 'llm') => {
    if (!project) {
      return;
    }
    let originalTools = project.tools ?? [];
    // Handle the remove logic here
    await updateProject({
      tools: [
        ...originalTools.map(tool => {
          if (
            tool.id === toolId &&
            tool.assigned?.find(a => a.agent === nodeId && a.scene === scene)
          ) {
            return {
              ...tool,
              assigned: [
                ...(tool.assigned || []).filter(
                  a => a.agent !== nodeId || a.scene !== scene
                ),
              ],
            } as Tool;
          }
          return tool;
        }),
      ],
    });
  };

  const ToolPanel = (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="py-4">{t('available-tools-tooltip')}</div>
      <div className="flex h-full w-full gap-2">
        <div className="flex w-64">
          <div className="flex flex-col gap-2 w-full h-full">
            <div className="flex items-center flex-0 justify-between w-full">
              {t('available-tools')}
              <Link
                href={`/projects/${projectId}/tools`}
                className="hover:text-primary"
              >
                <RiSettings3Line className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-col gap-1 h-full p-1 border border-primary/20 rounded">
              <div className="flex flex-col h-full items-center gap-1 overflow-y-auto ">
                {project?.tools &&
                  project.tools.map((tool: Tool) => (
                    <AvailableTool key={tool.id} tool={tool} />
                  ))}
                {(!project?.tools || project?.tools?.length === 0) && (
                  <div className="flex flex-col gap-2 w-full h-full justify-center items-center">
                    <RiToolsLine className="w-10 h-10 opacity-40" />
                    <span className=" opacity-40">{t('no-tools')}</span>
                    <Link
                      href={`/projects/${projectId}/tools`}
                      className="btn btn-sm btn-primary btn-outline rounded mt-4"
                    >
                      {t('create-tools')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            {t('tools-for-execution')}
            <Tip content={t('tools-for-execution-tooltip')} />
          </div>
          <DropZone
            placeholder={t('tools-for-execution-placeholder')}
            onDrop={(toolId: string) => handleDrop(toolId, 'execution')}
          >
            {project?.tools &&
              project.tools
                .filter(tool =>
                  tool.assigned?.find(
                    a => a.scene === 'execution' && a.agent === nodeId
                  )
                )
                .map((tool: Tool) => (
                  <AssignedTool
                    key={tool.id}
                    scene="execution"
                    tool={tool}
                    onRemove={handleRemove}
                  />
                ))}
          </DropZone>
          <div className="flex items-center gap-2">
            {t('tools-for-llm')}
            <Tip content={t('tools-for-llm-tooltip')} />
          </div>
          <DropZone
            placeholder={t('tools-for-llm-placeholder')}
            onDrop={(toolId: string) => handleDrop(toolId, 'llm')}
          >
            {project?.tools &&
              project.tools
                .filter(tool =>
                  tool.assigned?.find(
                    a => a.scene === 'llm' && a.agent === nodeId
                  )
                )
                .map((tool: Tool) => (
                  <AssignedTool
                    scene="llm"
                    key={tool.id}
                    tool={tool}
                    onRemove={handleRemove}
                  />
                ))}
          </DropZone>
        </div>
      </div>
    </div>
  );

  const GeneralPanel = () => {
    const GENERAL_OPTIONS = [
      {
        type: 'text',
        name: 'description',
        label: tGeneric('description'),
        placeholder: tGeneric('description-placeholder'),
        rows: 2,
      },
      {
        type: 'text',
        name: 'system_message',
        label: tGeneric('system-message'),
        placeholder: tGeneric('system-message-placeholder'),
        rows: 2,
      },
      {
        type: 'text',
        name: 'termination_msg',
        label: tGeneric('termination-msg'),
        compact: true,
      },
      {
        type: 'select',
        name: 'human_input_mode',
        label: tGeneric('human-input-mode'),
        options: [
          { value: 'NEVER', label: tGeneric('input-mode-never') },
          { value: 'ALWAYS', label: tGeneric('input-mode-always') },
          { value: 'TERMINATE', label: tGeneric('input-mode-terminate') },
        ],
        compact: true,
      },
      {
        type: 'number',
        name: 'max_consecutive_auto_reply',
        label: tGeneric('max-consecutive-auto-reply'),
      },
      {
        type: 'check',
        name: 'disable_llm',
        label: tGeneric('disable-llm'),
      },
      {
        type: 'check',
        name: 'enable_code_execution',
        label: tGeneric('enable-code-execution'),
      },
    ];
    return (
      <div className="flex flex-col gap-2 w-full h-full">
        {GENERAL_OPTIONS.map((options, index) => (
          <GenericOption key={index} nodeId={nodeId} data={data} {...options} />
        ))}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <PopupDialog
        title={
          <div className="flex items-center gap-2">
            <RiSettings3Line className="w-5 h-5" />
            <span className="text-md font-bold">{t('title')}</span>
          </div>
        }
        className={clsx(
          'flex flex-col bg-gray-800/80 backgrop-blur-md border border-gray-700 shadow-box-lg shadow-gray-700',
          className
        )}
        classNameTitle="border-b border-base-content/10"
        classNameBody="flex flex-1 w-full h-full p-2 gap-2 min-h-96 max-h-[500px] text-sm overflow-y-auto"
        {...props}
      >
        <TabGroup className="w-full h-full">
          <TabList className="w-full tabs tabs-bordered">
            <Tab className="tab">{t('general')}</Tab>
            <Tab className="tab">{t('tools')}</Tab>
          </TabList>
          <TabPanels className="p-2">
            <TabPanel>{GeneralPanel}</TabPanel>
            <TabPanel>{ToolPanel}</TabPanel>
          </TabPanels>
        </TabGroup>
      </PopupDialog>
    </DndProvider>
  );
};

export default ConversableAgentConfig;
