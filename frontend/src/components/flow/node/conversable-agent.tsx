import { ConversableAgentConfig } from '../config/conversable-agent';
import { GenericNode } from './generic-node';

export const ConversableAgent = ({ id, data, selected, ...props }: any) => {
  return (
    <GenericNode
      id={id}
      data={data}
      selected={selected}
      options={[
        'description',
        'system_message',
        'human_input_mode',
        'max_consecutive_auto_reply',
        'termination_msg',
        'disable_llm',
      ]}
      ports={[
        { type: 'input', name: 'input' },
        { type: 'output', name: 'output' },
      ]}
      ConfigDialog={ConversableAgentConfig}
      nodeClass="agent"
      nameEditable
      {...props}
    ></GenericNode>
  );
};
