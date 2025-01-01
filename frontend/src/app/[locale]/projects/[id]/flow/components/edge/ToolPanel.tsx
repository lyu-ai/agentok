import Tip from '@/components/tip';
import { useTool, useTools } from '@/hooks';
import { Tool } from '@/store/tools';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  RiCloseLine,
  RiDraggable,
  RiSettings3Line,
  RiToolsLine,
} from 'react-icons/ri';
import { useReactFlow } from 'reactflow';
import { setEdgeData } from '../../utils/flow';
import clsx from 'clsx';
import { useRef } from 'react';

const ItemType = {
  TOOL: 'tool',
};

const AvailableTool = ({ tool }: any) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TOOL,
    item: { id: tool.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className={clsx(
        'group flex w-full items-center justify-between gap-2 p-2 border bg-base-content/10 border-base-content/40 rounded cursor-move',
        {
          'border-primary': isDragging,
        }
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="font-bold line-clamp-1">
          {tool.name} {isDragging ? '👋' : ''}
        </div>
        <div className="text-xs line-clamp-1">{tool.description}</div>
      </div>
      <RiDraggable className="shrink-0" />
    </div>
  );
};

const AssignedTool = ({ toolId, onRemove }: any) => {
  const { tool } = useTool(toolId);
  if (!tool) return null;
  return (
    <div className="relative group flex w-48 h-16 items-center justify-between gap-1 p-2 bg-base-content/20 border border-base-content/40 rounded">
      <div className="flex flex-col gap-1">
        <div className="font-bold line-clamp-1">{tool.name}</div>
        <div className="text-xs line-clamp-1">{tool.description}</div>
      </div>
      <button
        onClick={() => onRemove(tool.id)}
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
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className={clsx(
        'flex w-full h-full min-h-32 flex-wrap gap-1 p-1 border border-dashed border-primary/20 rounded',
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

const ToolPanel = ({ edgeId, data }: any) => {
  const t = useTranslations('option.ConverseConfig');
  const { tools } = useTools();
  const reactflowInstance = useReactFlow();
  // node: { data: { tools: { execution: [toolId1, toolId2], llm: [toolId3, toolId4] } } }
  const assignTool = (toolId: number) => {
    const existingTools = data?.tools || [];

    // Check if the toolId already exists in the array
    if (!existingTools.includes(toolId)) {
      setEdgeData(reactflowInstance, edgeId, {
        ...data,
        tools: [...existingTools, toolId],
      });
    }
  };

  const removeTool = (toolId: number) => {
    const existingTools = data?.tools || [];

    // Check if the toolId exists in the array
    if (existingTools.includes(toolId)) {
      const updatedTools = existingTools.filter((id: number) => id !== toolId);

      setEdgeData(reactflowInstance, edgeId, {
        ...data,
        tools: updatedTools,
      });
    }
  };

  const handleDrop = async (toolId: number, scene: 'execution' | 'llm') => {
    assignTool(toolId);
  };

  const handleRemove = async (toolId: number, scene: 'execution' | 'llm') => {
    removeTool(toolId);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-2 w-full h-full text-sm">
        <div>{t('available-tools-tooltip')}</div>
        <div className="flex h-full w-full gap-2">
          <div className="flex w-64">
            <div className="flex flex-col gap-2 w-full h-full">
              <div className="flex items-center flex-0 gap-1 font-bold">
                {t('available-tools')}
                <Link href={`/tools`} className="link">
                  <RiSettings3Line className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-col gap-1 h-full p-1 border border-primary/20 rounded">
                <div className="flex flex-col h-full min-h-80 items-center gap-1 overflow-y-auto ">
                  {tools &&
                    tools.map((tool: Tool) => (
                      <AvailableTool key={tool.id} tool={tool} />
                    ))}
                  {(!tools || tools.length === 0) && (
                    <div className="flex flex-col gap-2 w-full h-full justify-center items-center">
                      <RiToolsLine className="w-10 h-10 opacity-40" />
                      <span className=" opacity-40">{t('no-tools')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 font-bold">
              {t('tools-assigned')}
              <Tip content={t('tools-assigned-tooltip')} />
            </div>
            <DropZone
              placeholder={t('tools-assigned-placeholder')}
              onDrop={(toolId: number) => handleDrop(toolId, 'execution')}
            >
              {data?.tools &&
                data.tools.map((toolId: number) => (
                  <AssignedTool
                    key={toolId}
                    toolId={toolId}
                    onRemove={handleRemove}
                  />
                ))}
            </DropZone>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default ToolPanel;
