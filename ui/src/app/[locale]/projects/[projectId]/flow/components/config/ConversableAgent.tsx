import React, { useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PopupDialog from '@/components/PopupDialog';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useProjectId } from '@/context/ProjectContext';
import { useProject } from '@/hooks';
import { Tool } from '@/store/projects';
import { RiCloseLine, RiDraggable, RiSettings3Line } from 'react-icons/ri';

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
        'group flex items-center justify-between gap-2 p-2 border bg-base-content/10 border-base-content/40 rounded cursor-pointer',
        {
          'border-primary': isDragging,
        }
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="font-bold">
          {tool.name} {isDragging ? '👋' : ''}
        </div>
        <div className="text-xs">{tool.description}</div>
      </div>
      <RiDraggable />
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

const DropZone = ({ onDrop, children }: any) => {
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
        'flex w-full min-h-48 flex-wrap gap-2 p-2 border border-primary/20 rounded',
        {
          'bg-gray-600': isOver,
        }
      )}
    >
      {children}
    </div>
  );
};

const ConversableAgentConfig = ({ nodeId, data, className, ...props }: any) => {
  const t = useTranslations('option.ConversableAgentConfig');
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
          'flex flex-col bg-gray-800/80 backgrop-blur-md min-h-96 border border-gray-700 shadow-box-lg shadow-gray-700',
          className
        )}
        classNameTitle="border-b border-base-content/10"
        classNameBody="flex flex-1 w-full h-full p-2 gap-2 text-sm overflow-y-auto"
        {...props}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="text-xs">{t('available-tools-tooltip')}</div>
          <div className="flex h-full w-full flex-1 gap-2">
            <div className="flex flex-col gap-2 h-full w-48 shrink-0">
              <div>{t('available-tools')}</div>

              <div className="flex flex-col flex-1 gap-1 h-full overflow-y-auto">
                {project?.tools &&
                  project.tools.map((tool: Tool) => (
                    <AvailableTool key={tool.id} tool={tool} />
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div>{t('tools-for-execution')}</div>
              <DropZone
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
              <div>{t('tools-for-llm')}</div>
              <DropZone onDrop={(toolId: string) => handleDrop(toolId, 'llm')}>
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
      </PopupDialog>
    </DndProvider>
  );
};

export default ConversableAgentConfig;
