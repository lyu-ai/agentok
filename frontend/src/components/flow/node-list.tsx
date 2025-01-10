'use client';

import React from 'react';
import { advancedNodes, basicNodes, getNodeIcon } from '@/lib/flow';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { PopoverClose } from '../ui/popover';

interface NodeItemProps {
  id: string;
  name: string;
  type: string;
  description?: string;
  class_type: string;
  width?: number;
  height?: number;
}

const NodeItem = ({
  id,
  name,
  type,
  description,
  class_type,
  width,
  height,
}: NodeItemProps) => {
  const NodeIcon = getNodeIcon(type);
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeData: any
  ) => {
    event.dataTransfer.setData('application/json', JSON.stringify(nodeData));
  };

  return (
    <div
      className={cn(
        'flex flex-col items-start gap-2 w-full h-full p-2 rounded-md border cursor-grab',
        'hover:bg-muted'
      )}
      draggable
      onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
        onDragStart(e, { id, name, type, class_type, width, height })
      }
    >
      <div className="flex items-center gap-2 w-full h-full">
        <NodeIcon className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="text-left text-xs text-muted-foreground line-clamp-2">
        {description}
      </span>
    </div>
  );
};

export const NodeList = ({
  onAddNode,
}: {
  onAddNode: (
    id: string,
    name: string,
    class_type: string,
    width?: number,
    height?: number
  ) => void;
}) => {
  return (
    <Accordion type="multiple" defaultValue={['Basic']} className="w-full p-2">
      {[
        {
          title: 'Basic',
          nodes: basicNodes,
        },
        {
          title: 'Advanced',
          nodes: advancedNodes,
        },
      ].map(({ title, nodes }) => (
        <AccordionItem value={title} className="border-none" key={title}>
          <AccordionTrigger className="text-sm outline-none py-2">
            {title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-1">
              {nodes.map((node) => (
                <PopoverClose
                  key={node.id}
                  onClick={() =>
                    onAddNode(
                      node.id,
                      node.name,
                      node.class_type,
                      node.width,
                      node.height
                    )
                  }
                >
                  <NodeItem
                    id={node.id}
                    name={node.name}
                    type={node.id}
                    description={node.description}
                    class_type={node.class_type}
                    width={node.width}
                    height={node.height}
                  />
                </PopoverClose>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
