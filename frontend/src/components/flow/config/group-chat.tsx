'use client';

import { GenericOption } from '../option/option';

export const GroupChatConfig = ({ nodeId, data }: any) => {
  return (

    <div className="flex flex-col gap-4">
      <GenericOption
        type="select"
        nodeId={nodeId}
        data={data}
        name="speaker_selection_method"
        label="Speaker Selection Method"
        options={[
          { value: 'auto', label: 'Auto' },
          { value: 'round_robin', label: 'Round Robin' },
          { value: 'random', label: 'Random' },
          { value: 'manual', label: 'Manual' },
        ]}
      />
      <GenericOption
        type="number"
        nodeId={nodeId}
        data={data}
        name="max_round"
        label="Max Round"
        min={1}
        max={100}
      />
      <GenericOption
        type="check"
        nodeId={nodeId}
        data={data}
        name="allow_repeat_speaker"
        label="Allow Repeat Speaker"
      />
    </div>
  );
};
