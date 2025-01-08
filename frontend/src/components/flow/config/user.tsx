'use client';

import { GenericOption } from '../option/option';
import { ConversableAgentConfig } from './conversable-agent';

export const UserConfig = ({ nodeId, data }: any) => {
  return (
    <ConversableAgentConfig
      className="flex flex-col gap-4 p-2"
      nodeId={nodeId}
      data={data}
      toolScene={'user'}
    >
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
        type="check"
        nodeId={nodeId}
        data={data}
        name="enable_code_execution"
        label="Enable Code Execution"
      />
    </ConversableAgentConfig>
  );
};
