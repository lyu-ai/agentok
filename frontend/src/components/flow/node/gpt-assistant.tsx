'use client';

import React from 'react';
import { NodeProps } from '@xyflow/react';
import { GenericNode } from './generic-node';
import { ConversableAgentConfig } from '../config/conversable-agent';
import { GenericOption } from '../option/option';

export const GPTAssistantNode = ({
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
