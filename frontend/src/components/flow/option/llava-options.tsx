'use client';

import React from 'react';
import { GenericOption } from './option';

export const LLaVAOptions = ({ nodeId, data, selected }: any) => {
  return (
    <>
      <GenericOption
        type="select"
        nodeId={nodeId}
        data={data}
        selected={selected}
        name="model"
        label="Model"
        options={[
          { value: 'llava-v1.5-7b', label: 'LLaVA v1.5 7B' },
          { value: 'llava-v1.5-13b', label: 'LLaVA v1.5 13B' },
        ]}
      />
      <GenericOption
        type="check"
        nodeId={nodeId}
        data={data}
        selected={selected}
        name="use_local"
        label="Use Local Model"
      />
      <GenericOption
        type="text"
        nodeId={nodeId}
        data={data}
        selected={selected}
        name="local_model_path"
        label="Local Model Path"
        placeholder="Enter path to local model..."
      />
    </>
  );
};
