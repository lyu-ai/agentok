import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as style } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from '@/components/CopyButton';
import ViewToggle from './ViewToggle';
import { useState, useEffect } from 'react';
import { GoAlertFill } from 'react-icons/go';
import { useTranslations } from 'next-intl';
import DownloadButton from '@/components/DownloadButton';

const Python = ({ data, setMode }: any) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    code: number;
    python?: string;
    message?: string;
  }>({ code: 0, python: '', message: '' });
  const t = useTranslations('page.Python');

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
      .then(resp => resp.json())
      .then(json => {
        if (json.error) {
          setResult({ code: 400, message: json.error });
          return;
        } else {
          setResult({ code: 200, python: json.code });
        }
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
    <div className="w-full h-full pb-2">
      {result.code !== 200 || !result.python ? (
        <div className="flex w-full h-full items-center justify-center">
          <div className="flex flex-col items-center text-sm bg-red-600/30 text-red-600 rounded-md border border-red-600 gap-2 p-4">
            <GoAlertFill className="w-8 h-8" />
            <span className="font-bold">{t('generate-fail')}</span>
            <span>{result.message}</span>
          </div>
        </div>
      ) : (
        <SyntaxHighlighter
          language="python"
          style={style}
          className="h-full text-xs text-base-content"
        >
          {result.python}
        </SyntaxHighlighter>
      )}
      <div className="absolute flex items-center gap-1 right-2 top-2">
        <ViewToggle mode={'flow'} setMode={setMode} />
        <ViewToggle mode={'json'} setMode={setMode} />{' '}
        <CopyButton content={result.python ?? result.message ?? ''} />
        {result.python && (
          <DownloadButton
            data={result.python}
            label={t('download')}
            filename={`${data?.name ?? 'flow2py'}.py`}
          />
        )}
      </div>
    </div>
  );
};

export default Python;
