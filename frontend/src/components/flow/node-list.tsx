'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Icons } from '@/components/icons';
import { useSettings } from '@/hooks';
import { getNodeIcon } from '@/lib/flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

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
    <div
      className={cn(
        'flex items-center gap-2 w-full p-2 rounded-md border cursor-grab',
        'hover:border-primary/40 hover:bg-primary/5',
      )}
      onClick={onClick}
      draggable
    >
      <NodeIcon className="w-5 h-5" />
      <span className="text-sm">{name}</span>
      <Icons.resize className="w-5 h-5" />
    </div>
  );
};

export const NodeList = () => {
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
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="basic">
        <AccordionTrigger>Basic</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-1">
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
          <div className="flex flex-col gap-1">
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
          <div className="flex flex-col gap-1">
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
          <div className="flex flex-col gap-1">
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
  );
};
