'use client';

import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { advancedNodes, agentNodes, basicNodes, getNodeIcon } from '@/lib/flow';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';

interface NodeItemProps {
  id: string;
  name: string;
  type: string;
  description?: string;
  nodeClass?: string;
  onClick?: () => void;
}

const NodeItem = ({
  id,
  name,
  type,
  description,
  nodeClass = 'general',
  onClick,
}: NodeItemProps) => {
  const NodeIcon = getNodeIcon(type);
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeData: any
  ) => {
    console.log('onDragStart', event, nodeData);
    event.dataTransfer.setData('application/json', JSON.stringify(nodeData));
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 w-full p-2 rounded-md border cursor-grab',
        'hover:border-primary/40 hover:bg-primary/5'
      )}
      onClick={onClick}
      draggable
      onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
        onDragStart(e, { id, name })
      }
    >
      <NodeIcon className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </span>
      </div>
    </div>
  );
};

export const NodeList = () => {
  const instance = useReactFlow();

  const addNode = useCallback(
    (type: string, nodeClass: string) => {
      const position = {
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100,
      };

      const newNode = {
        id: nanoid(),
        type,
        position,
        data: {
          name: type,
          class: nodeClass,
        },
      };

      instance.addNodes(newNode);
    },
    [instance]
  );

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="Basic"
      className="w-full p-2"
    >
      {[
        {
          title: 'Basic',
          nodes: basicNodes,
        },
        {
          title: 'Agents',
          nodes: agentNodes,
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
                <NodeItem
                  id={node.id}
                  key={node.id}
                  name={node.name}
                  type={node.type}
                  description={node.description}
                  nodeClass={node.class}
                  onClick={() => addNode(node.type, node.class)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
