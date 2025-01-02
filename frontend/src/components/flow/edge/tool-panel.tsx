'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GenericOption } from '../option/option';

export const ToolPanel = ({ show, onClose, nodeId, data, settings }: any) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tool Configuration</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <GenericOption
            type="select"
            nodeId={nodeId}
            data={data}
            name="tool_type"
            label="Tool Type"
            options={[
              { value: 'code', label: 'Code' },
              { value: 'python', label: 'Python' },
              { value: 'shell', label: 'Shell' },
            ]}
          />
          <GenericOption
            type="textarea"
            nodeId={nodeId}
            data={data}
            name="code"
            label="Code"
            placeholder="Enter code to execute..."
            className="min-h-[100px]"
          />
          <GenericOption
            type="switch"
            nodeId={nodeId}
            data={data}
            name="use_docker"
            label="Use Docker"
          />
          <GenericOption
            type="text"
            nodeId={nodeId}
            data={data}
            name="work_dir"
            label="Working Directory"
            placeholder="Enter working directory..."
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
