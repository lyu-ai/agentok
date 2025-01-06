import { GenericNode } from './generic-node';

export const UserProxyAgent = ({ ...props }: any) => {
  return (
    <GenericNode ports={[{ type: 'source' }, { type: 'target' }]} {...props} />
  );
};
