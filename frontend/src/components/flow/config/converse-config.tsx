'use client';

import { GenericOption } from '../option/option';

export const ConverseConfig = ({ edgeId, data }: any) => {
  return (
    <div className="flex flex-col gap-4">
      <GenericOption
        type="select"
        nodeId={edgeId}
        data={data}
        name="mode"
        label="Mode"
        options={[
          { value: 'auto', label: 'Auto' },
          { value: 'manual', label: 'Manual' },
        ]}
      />
      <GenericOption
        type="number"
        nodeId={edgeId}
        data={data}
        name="max_round"
        label="Max Round"
        min={1}
        max={100}
      />
      <GenericOption
        type="check"
        nodeId={edgeId}
        data={data}
        name="allow_repeat"
        label="Allow Repeat"
      />
    </div>
  );
};
