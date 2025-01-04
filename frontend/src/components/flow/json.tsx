'use client';

import React, { useEffect, useState } from 'react';
import { CopyButton } from '../copy-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProject } from '@/hooks';
import { cn } from '@/lib/utils';

interface JsonViewerProps {
  projectId: number;
  className?: string;
}

export const JsonViewer = ({ projectId, className }: JsonViewerProps) => {
  const { project, isLoading, isError } = useProject(projectId);
  const [jsonString, setJsonString] = useState('');

  useEffect(() => {
    if (project) {
      setJsonString(JSON.stringify(project, null, 2));
    }
  }, [project]);

  return (
    <ScrollArea className={cn("relative flex w-full h-full", className)}>
      <div className="absolute top-2 right-3">
        <CopyButton content={jsonString} />
      </div>
      <pre className="text-sm p-4 text-xs overflow-auto">
        {jsonString}
      </pre>
    </ScrollArea>
  );
};
