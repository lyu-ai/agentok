import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeLight, vscodeDark } from '@uiw/codemirror-theme-vscode';
import { CopyButton } from '@/components/copy-button';
import { DownloadButton } from '@/components/download-button';
import { Icons } from '../icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';
import { useProject } from '@/hooks';
import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const PythonViewer = ({ projectId, setMode }: any) => {
  const { resolvedTheme } = useTheme();
  const { project, isLoading } = useProject(projectId);
  const [code, setCode] = useState('');
  const [isGeneratingPython, setIsGeneratingPython] = useState(false);
  const generatePython = useCallback(async (): Promise<string> => {
    if (!project?.flow) return '';
    setIsGeneratingPython(true);
    const python = await fetch('/api/codegen', {
      method: 'POST',
      body: JSON.stringify(project),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((json) => json.code)
      .catch((e) => {
        console.warn(e);
        toast({
          title: 'Error generating Python code',
          description: e.message,
          variant: 'destructive',
        });
      })
      .finally(() => setIsGeneratingPython(false));
    return python;
  }, [project]);

  useEffect(() => {
    generatePython().then((python) => {
      setCode(python);
    });
  }, [project, project?.updated_at]);

  if (isLoading || !project || isGeneratingPython) {
    return (
      <div className="relative flex w-full h-full items-center justify-center">
        <Icons.logoSimple className="w-12 h-12 text-muted-foreground/50 animate-pulse" />
      </div>
    );
  }

  return (
    <ScrollArea className="relative flex flex-col w-full h-[calc(100vh-var(--header-height))] overflow-x-auto">
      <CodeMirror
        value={code}
        height="100%"
        theme={resolvedTheme === 'dark' ? vscodeDark : vscodeLight}
        extensions={[python()]}
        editable={false}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: false,
          highlightActiveLine: false,
        }}
        className="text-xs overflow-x-auto mt-0"
      />
      <div className="absolute flex items-center gap-2 right-2 top-12">
        {code && (
          <>
            <CopyButton content={code} />
            <DownloadButton
              data={code}
              label="Download"
              filename={`${project?.name ?? 'flow2py'}.py`}
            />
          </>
        )}
      </div>
    </ScrollArea>
  );
};
