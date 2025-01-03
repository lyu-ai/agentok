'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';
import { CopyButton } from '../copy-button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JsonViewerProps {
  data: any;
}

export const JsonViewer = ({ data }: JsonViewerProps) => {
  const [jsonString, setJsonString] = useState('');

  useEffect(() => {
    if (data) {
      setJsonString(JSON.stringify(data, null, 2));
    }
  }, [data]);

  return (
    <ScrollArea className="relative flex w-full h-full">
      <div className="absolute top-2 right-3">
        <CopyButton content={jsonString} />
      </div>
      <pre className="text-sm p-4 text-xs overflow-auto">
        {jsonString}
      </pre>
    </ScrollArea>
  );
};
