import { UserConfig } from '../config/user';
import { GenericNode } from './generic-node';

export const UserProxyAgent = ({ id, selected, data, ...props }: any) => {
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
