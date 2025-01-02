'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GenericOption } from '../option/option';

export const UserConfig = ({ show, onClose, nodeId, data, settings }: any) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Configuration</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
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
            type="switch"
            nodeId={nodeId}
            data={data}
            name="disable_llm"
            label="Disable LLM"
          />
          <GenericOption
            type="switch"
            nodeId={nodeId}
            data={data}
            name="enable_code_execution"
            label="Enable Code Execution"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
