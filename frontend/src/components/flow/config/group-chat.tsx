'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GenericOption } from '../option/option';

export const GroupChatConfig = ({ show, onClose, nodeId, data, settings }: any) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group Chat Configuration</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};
