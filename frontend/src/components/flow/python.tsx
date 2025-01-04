import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as style } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyButton } from '@/components/copy-button';
import { useState, useEffect } from 'react';
import { DownloadButton } from '@/components/download-button';
import { Icons } from '../icons';
import { Button } from '../ui/button';

export const PythonViewer = ({ data, setMode }: any) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    code: number;
    python?: string;
    message?: string;
  }>({ code: 0, python: '', message: '' });
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.flow) return;
    setLoading(true);
    fetch('/api/codegen', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error) {
          setErrorDetail(json.error.detail);
        } else {
          setResult({ code: 200, python: json.code });
          setErrorDetail(null); // Clear previous error details
        }
      })
      .catch((e) => {
        console.warn(e);
        setErrorDetail(e.message);
      })
      .finally(() => setLoading(false));
  }, [data]);

  if (loading) {
    return (
      <div className="relative flex flex-col w-full h-full items-center justify-center gap-2">
        <div className="loading text-primary loading-infinity"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full pb-2">
      {result.code !== 200 || !result.python ? (
        <div className="flex w-full h-full items-center justify-center">
          <div className="flex flex-col items-center text-sm bg-red-600/10 text-red-600 rounded-md border border-red-600 min-w-96 gap-2 p-4">
            <Icons.alert className="w-6 h-6" />
            <span className="font-bold">Failed to generate Python code</span>
            <span>{result.message}</span>
            {errorDetail && (
              <div className="text-xs text-left bg-yellow-400 p-2 rounded">
                {errorDetail}
              </div>
            )}
            <Button variant="outline" onClick={() => setMode('flow')}>
              <Icons.chevronLeft className="w-4 h-4" />
              Back to Flow
            </Button>
          </div>
        </div>
      ) : (
        <SyntaxHighlighter
          showLineNumbers
          language="python"
          style={style}
          className="h-full text-xs text-base-content"
        >
          {result.python}
        </SyntaxHighlighter>
      )}
      <div className="absolute flex items-center gap-2 right-4 top-5">
        <Button variant="ghost" size="sm" onClick={() => setMode('flow')}>
          <Icons.chevronLeft className="w-4 h-4" />
          <span className="text-xs">Back to Flow</span>
        </Button>
        {result.python && (
          <>
            <CopyButton content={result.python} />
            <DownloadButton
              data={result.python}
              label="Download"
              filename={`${data?.name ?? 'flow2py'}.py`}
            />
          </>
        )}
      </div>
    </div>
  );
};
