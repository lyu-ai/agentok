'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Icons } from '@/components/icons';
import { useSettings } from '@/hooks';
import { getNodeIcon } from '@/lib/flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NodeButtonProps {
  name: string;
  type: string;
  description?: string;
  nodeClass?: string;
  onClick?: () => void;
}

const NodeButton = ({ name, type, description, nodeClass = 'general', onClick }: NodeButtonProps) => {
  const NodeIcon = getNodeIcon(type);

  return (
    <Button
      type="button"
      className={cn(
        'flex items-center gap-2 w-full p-2 rounded-lg border',
        'hover:border-primary/40 hover:bg-base-content/5',
      )}
      onClick={onClick}
    >
      <NodeIcon className="w-5 h-5" />
      <span className="text-sm">{name}</span>
    </Button>
  );
};

export const NodePane = () => {
  const [nodePanePinned, setNodePanePinned] = useState(false);
  const instance = useReactFlow();
  const { settings } = useSettings();

  const addNode = useCallback(
    (type: string, nodeClass: string) => {
      const position = {
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100,
      };

      const newNode = {
        id: crypto.randomUUID(),
        type,
        position,
        data: {
          name: type,
          class: type,
        },
      };

      instance.addNodes(newNode);
    },
    [instance]
  );

  return (
    <div
      className={cn(
        'absolute top-4 right-4 z-10 flex flex-col gap-2 p-4 rounded-xl border shadow-box',
        'bg-base-content/10 border-base-content/10',
        'hover:border-primary/40',
        {
          'opacity-100': nodePanePinned,
          'opacity-0 hover:opacity-100': !nodePanePinned,
        }
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="font-bold">Add Node</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setNodePanePinned(!nodePanePinned)}
        >
          <Icons.pin className="w-4 h-4" />
        </Button>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="basic">
          <AccordionTrigger>Basic</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <NodeButton
                name="Initializer"
                type="Initializer"
                description="Configure initial settings for the chat session"
                onClick={() => addNode('Initializer', 'general')}
              />
              <NodeButton
                name="Note"
                type="Note"
                description="Add a note to document your flow"
                onClick={() => addNode('Note', 'general')}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="agent">
          <AccordionTrigger>Agents</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <NodeButton
                name="Assistant"
                type="AssistantAgent"
                description="A basic assistant agent"
                nodeClass="agent"
                onClick={() => addNode('AssistantAgent', 'agent')}
              />
              <NodeButton
                name="GPT Assistant"
                type="GPTAssistantAgent"
                description="An assistant powered by GPT"
                nodeClass="agent"
                onClick={() => addNode('GPTAssistantAgent', 'agent')}
              />
              <NodeButton
                name="Retrieve Assistant"
                type="RetrieveAssistantAgent"
                description="An assistant with retrieval capabilities"
                nodeClass="agent"
                onClick={() => addNode('RetrieveAssistantAgent', 'agent')}
              />
              <NodeButton
                name="LLaVA Assistant"
                type="LLaVAAgent"
                description="An assistant with vision capabilities"
                nodeClass="agent"
                onClick={() => addNode('LLaVAAgent', 'agent')}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="advanced">
          <AccordionTrigger>Advanced</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <NodeButton
                name="User"
                type="UserProxyAgent"
                description="A proxy for user interaction"
                nodeClass="agent"
                onClick={() => addNode('UserProxyAgent', 'agent')}
              />
              <NodeButton
                name="Retrieve User"
                type="RetrieveUserProxyAgent"
                description="A user proxy with retrieval capabilities"
                nodeClass="agent"
                onClick={() => addNode('RetrieveUserProxyAgent', 'agent')}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="extensions">
          <AccordionTrigger>Extensions</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <NodeButton
                name="Group Chat"
                type="GroupChat"
                description="A group chat with multiple agents"
                nodeClass="group"
                onClick={() => addNode('GroupChat', 'group')}
              />
              <NodeButton
                name="Nested Chat"
                type="NestedChat"
                description="A nested chat session"
                nodeClass="group"
                onClick={() => addNode('NestedChat', 'group')}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
