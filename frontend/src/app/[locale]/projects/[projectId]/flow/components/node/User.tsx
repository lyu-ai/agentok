import ConversableAgentConfig from '../config/ConversableAgent';
import UserConfig from '../config/User';
import GenericNode from './GenericNode';

const UserProxyAgent = ({ id, selected, data, ...props }: any) => {
  return (
    <GenericNode
      id={id}
      data={data}
      selected={selected}
      nodeClass="agent"
      nameEditable
      options={[
        'description',
        'system_message',
        'human_input_mode',
        'max_consecutive_auto_reply',
      ]}
      optionsDisabled={['disable_llm']}
      ports={[{ type: 'input' }, { type: 'output' }]}
      ConfigDialog={UserConfig}
      {...props}
    />
  );
};

export default UserProxyAgent;
