import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeLight, vscodeDark } from '@uiw/codemirror-theme-vscode';
import { CopyButton } from '@/components/copy-button';
import { DownloadButton } from '@/components/download-button';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useTheme } from 'next-themes';

export const PythonViewer = ({ data, setMode }: any) => {
  const { resolvedTheme } = useTheme();

  return (
    <ScrollArea className="relative flex flex-col w-full h-[calc(100vh-var(--header-height))] overflow-x-auto">
      <CodeMirror
        value={data}
        height="100%"
        theme={resolvedTheme === 'dark' ? vscodeDark : vscodeLight}
        extensions={[python()]}
        editable={false}
        className="text-xs overflow-x-auto mt-0"
      />
      <div className="absolute flex items-center gap-2 right-4 top-5">
        <Button variant="ghost" size="sm" onClick={() => setMode('flow')}>
          <Icons.chevronLeft className="w-4 h-4" />
          <span className="text-xs">Back to Flow</span>
        </Button>
        {data && (
          <>
            <CopyButton content={data} />
            <DownloadButton
              data={data}
              label="Download"
              filename={`${data?.name ?? 'flow2py'}.py`}
            />
          </>
        )}
      </div>
    </ScrollArea>
  );
};
