'use client';

import React, { useEffect, useState } from 'react';
import { CopyButton } from '../copy-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProject } from '@/hooks';
import { cn } from '@/lib/utils';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { useTheme } from 'next-themes';
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from '@codemirror/language';
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
    <ScrollArea className={cn('relative flex w-full h-full', className)}>
      <div className="absolute top-2 right-3">
        <CopyButton content={jsonString} />
      </div>
      <CodeMirror
        value={jsonString}
        extensions={[json(), syntaxHighlighting(defaultHighlightStyle)]}
        theme={resolvedTheme === 'dark' ? vscodeDark : vscodeLight}
        className="h-full text-xs overflow-x-auto"
        basicSetup={{ lineNumbers: false }}
      />
    </ScrollArea>
  );
};
