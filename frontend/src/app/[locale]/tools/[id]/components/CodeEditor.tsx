import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark as theme } from '@uiw/codemirror-theme-vscode';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useCallback } from 'react';
import { useTool } from '@/hooks';
import { debounce } from 'lodash-es';
import { Icons } from '@/components/icons';

interface CodeEditorProps {
  toolId: number;
  [key: string]: any;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  toolId,
  className,
}: CodeEditorProps) => {
  const t = useTranslations('tool.Editor');
  const { tool, updateTool, isUpdating } = useTool(toolId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [code, setCode] = useState<string | undefined>('');

  useEffect(() => {
    if (tool?.code !== code) setCode(tool?.code);
  }, []);

  const debouncedUpdateProject = useCallback(
    debounce(async (updatedCode: string) => {
      let updatedTool = { code: updatedCode };
      // const meta = await extractMeta(updatedCode);
      // if (meta) {
      //   updatedTool = { ...updatedTool, ...meta };
      // }
      updateTool(updatedTool);
    }, 500),
    [toolId]
  );

  useEffect(() => {
    if (code) {
      debouncedUpdateProject(code);
    }
  }, [code]);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/codegen/tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(tool),
      });

      if (res.ok) {
        const generatedFunc = await res.json();
        setCode(generatedFunc.code);
      } else {
        console.error('Failed to generate code');
      }
    } catch (error) {
      console.error('An error occurred while generating code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const extractMeta = async (code: string) => {
    setIsExtracting(true);
    try {
      const res = await fetch('/api/codegen/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        const extractedMeta = await res.json();
        console.log(extractedMeta);
        return extractedMeta;
      } else {
        console.error('Failed to extract meta');
      }
    } catch (error) {
      console.error('An error occurred while extracting meta:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className={clsx(className, 'flex flex-col w-full h-full gap-2')}>
      <div className="rounded overflow-hidden border h-full border-base-content/20">
        <div className="w-full h-full relative group">
          <CodeMirror
            value={code ?? ''}
            height="100%"
            theme={theme}
            extensions={[python()]}
            onChange={(value) => setCode(value)}
            style={{ fontSize: '0.75rem', height: '100%' }}
          />
          <div
            className={clsx('absolute flex items-center gap-1', {
              'right-2 bottom-2 translate-x-0 translate-y-0': code !== '',
              'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2': code === '',
            })}
          >
            <button
              className={clsx(
                'btn rounded gap-1',
                code ? 'btn-sm btn-outline' : 'btn-primary'
              )}
              data-tooltip-id="func-tooltip"
              data-tooltip-content={t('generate-code-tooltip')}
              onClick={handleGenerateCode}
            >
              <Icons.sparkles
                className={clsx('w-5 h-5', { 'animate-spin': isGenerating })}
              />
              <span>{t('generate-code')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
