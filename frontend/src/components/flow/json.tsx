'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';
import { CopyButton } from '../copy-button';

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
    <div className="relative flex flex-col gap-4 w-full h-full overflow-auto">
      <div className="absolute top-0 right-0">
        <CopyButton content={jsonString} />
      </div>
      <pre className="text-sm bg-base-content/5 p-4 rounded overflow-auto max-h-[500px]">
        {jsonString}
      </pre>
    </div>
  );
};
