'use client';

import { GenericOption } from '../option/option';

export const UserConfig = ({ nodeId, data }: any) => {
  return (
    <div className="flex flex-col gap-4 p-2">
      <GenericOption
        type="select"
        nodeId={nodeId}
        data={data}
        name="human_input_mode"
        label="Human Input Mode"
        options={[
          { value: 'NEVER', label: 'Never' },
          { value: 'ALWAYS', label: 'Always' },
          { value: 'TERMINATE', label: 'On Terminate' },
        ]}
      />
      <GenericOption
        type="number"
        nodeId={nodeId}
        data={data}
        name="max_consecutive_auto_reply"
        label="Max Consecutive Auto Reply"
        min={1}
        max={100}
      />
      <GenericOption
        type="check"
        nodeId={nodeId}
        data={data}
        name="disable_llm"
        label="Disable LLM"
      />
      <GenericOption
        type="check"
        nodeId={nodeId}
        data={data}
        name="enable_code_execution"
        label="Enable Code Execution"
      />
    </div>
  );
};
