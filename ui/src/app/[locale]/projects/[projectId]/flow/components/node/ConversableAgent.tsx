import ConversableAgentConfig from '../config/ConversableAgent';
import GenericNode from './GenericNode';

const ConversableAgent = ({ id, data, selected, ...props }: any) => {
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

export default ConversableAgent;
