'use client';

import React from 'react';
import { NodeProps } from 'reactflow';
import { GenericNode } from './generic-node';
import { ConversableAgentConfig } from '../config/conversable-agent';
import { GenericOption } from '../option/option';

interface RetrieveAssistantProps extends NodeProps {
  id: string;
  data: any;
  selected: boolean;
  type: string;
  zIndex: number;
  isConnectable: boolean;
  xPos: number;
  yPos: number;
  dragging: boolean;
}

export const RetrieveAssistantNode = ({
  id,
  data,
  selected,
  type,
  zIndex,
  isConnectable,
  xPos,
  yPos,
  dragging,
}: RetrieveAssistantProps) => {
  return (
    <GenericNode
      id={id}
      data={data}
      selected={selected}
      type={type}
      zIndex={zIndex}
      isConnectable={isConnectable}
      xPos={xPos}
      yPos={yPos}
      dragging={dragging}
      nodeClass="agent"
      className="min-w-80"
      ports={[{ type: 'target', name: '' }, { type: 'source', name: '' }]}
      ConfigDialog={ConversableAgentConfig}
      optionComponent={GenericOption}
      optionsDisabled={[
        'human_input_mode',
        'disable_llm',
        'enable_code_execution',
      ]}
    >
      <GenericOption
        type="textarea"
        nodeId={id}
        data={data}
        selected={selected}
        name="instructions"
        label="Instructions"
        placeholder="Enter instructions for the assistant..."
        className="min-h-[100px]"
      />
      <GenericOption
        type="switch"
        nodeId={id}
        data={data}
        selected={selected}
        name="use_default_instructions"
        label="Use default instructions"
      />
    </GenericNode>
  );
};

