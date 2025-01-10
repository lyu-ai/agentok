import { NodeProps } from '@xyflow/react';
import { GenericNode } from './generic-node';

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
      ports={[
        { type: 'source', name: '' },
        { type: 'target', name: '' },
      ]}
    />
  );
};
