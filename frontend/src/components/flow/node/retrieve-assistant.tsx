'use client';

import React from 'react';
import { NodeProps } from '@xyflow/react';
import { GenericNode } from './generic-node';
import { ConversableAgentConfig } from '../config/conversable-agent';
import { GenericOption } from '../option/option';


export const RetrieveAssistantNode = ({
  id,
  data,
  selected,
  type,
  ...props
}: NodeProps) => {
  return (
    <GenericNode
      {...props}
      id={id}
      data={data}
      selected={selected}
      type={type}
      ports={[{ type: 'target', name: '' }, { type: 'source', name: '' }]}
      config={ConversableAgentConfig}
    >
      <GenericOption
        type="text"
        nodeId={id}
        data={data}
        selected={selected}
        name="instructions"
        label="Instructions"
        placeholder="Enter instructions for the assistant..."
        className="min-h-[100px]"
      />
      <GenericOption
        type="check"
        nodeId={id}
        data={data}
        selected={selected}
        name="use_default_instructions"
        label="Use default instructions"
      />
    </GenericNode>
  );
};

