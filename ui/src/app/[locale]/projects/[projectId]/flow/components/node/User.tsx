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
      options={['description', 'system_message', 'max_consecutive_auto_reply']}
      ports={[{ type: 'input' }, { type: 'output' }]}
      ConfigDialog={UserConfig}
      {...props}
    />
  );
};

export default UserProxyAgent;
