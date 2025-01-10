'use client';

import React, { useEffect, useState } from 'react';
import { CopyButton } from '../copy-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProject } from '@/hooks';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  tomorrow,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

interface JsonViewerProps {
  projectId: number;
  className?: string;
}

export const JsonViewer = ({ projectId, className }: JsonViewerProps) => {
  const { project, isLoading, isError } = useProject(projectId);
  const [jsonString, setJsonString] = useState('');
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (project) {
      setJsonString(JSON.stringify(project, null, 2));
    }
  }, [project]);

  return (
    <ScrollArea
      className={cn('relative flex w-full h-full overflow-x-auto', className)}
    >
      <div className="absolute top-2 right-3 z-10">
        <CopyButton content={jsonString} />
      </div>
      <SyntaxHighlighter
        language="json"
        style={resolvedTheme === 'dark' ? tomorrow : oneLight}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.75rem',
          height: '100%',
        }}
      >
        {jsonString}
      </SyntaxHighlighter>
    </ScrollArea>
  );
};
