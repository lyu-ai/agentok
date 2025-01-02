import { NodeProps } from '@xyflow/react';
import { ConversableAgentConfig } from '../config/conversable-agent';
import { GenericNode } from './generic-node';
import { GenericOption } from '../option/option';

export const RetrieveUserProxyAgent = ({
  id,
  selected,
  data,
  ...props
}: NodeProps) => {
  return (
    <GenericNode
      {...props}
      id={id}
      data={data}
      selected={selected}
      nodeClass="agent"
      nameEditable
      options={['description', 'system_message', 'human_input_mode', 'max_consecutive_auto_reply']}
      optionsDisabled={['disable_llm']}
      ports={[{ type: 'source', name: '' }, { type: 'target', name: '' }]}
      ConfigDialog={ConversableAgentConfig}
      optionComponent={GenericOption}
      {...props}
    />
  );
};
