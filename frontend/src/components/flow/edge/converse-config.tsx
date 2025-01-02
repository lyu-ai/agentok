'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GenericOption } from '../option/option';

export const ConverseConfig = ({ show, onClose, nodeId, data, settings }: any) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conversation Configuration</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <GenericOption
            type="select"
            nodeId={nodeId}
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
            name="allow_repeat"
            label="Allow Repeat"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
