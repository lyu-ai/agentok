'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface JsonViewerProps {
  show: boolean;
  onClose: () => void;
  data: any;
}

export const JsonViewer = ({ show, onClose, data }: JsonViewerProps) => {
  const [jsonString, setJsonString] = useState('');

  useEffect(() => {
    if (data) {
      setJsonString(JSON.stringify(data, null, 2));
    }
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>JSON View</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">View and copy JSON data</div>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={handleCopy}
              data-tooltip-id="default-tooltip"
              data-tooltip-content="Copy to clipboard"
            >
              <Icons.copy className="w-4 h-4" />
            </button>
          </div>
          <pre className="text-sm bg-base-content/5 p-4 rounded overflow-auto max-h-[500px]">
            {jsonString}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};
