import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark as theme } from '@uiw/codemirror-theme-vscode';
import { RiMagicFill } from 'react-icons/ri';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useCallback } from 'react';
import { useProject } from '@/hooks';
import { debounce } from 'lodash-es';
import { deepEqual } from 'assert';

interface CodeEditorProps {
  projectId: string;
  tool: {
    id: string;
    code: string;
  };
  [key: string]: any;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  projectId,
  tool,
  ...props
}) => {
  const t = useTranslations('tool.Editor');
  const [isGenerating, setIsGenerating] = useState(false);
  const { project, updateProject } = useProject(projectId);
  const [code, setCode] = useState<string | undefined>(tool?.code);

  useEffect(() => {
    if (tool?.code !== code) setCode(tool?.code);
  }, [tool]);

  const debouncedUpdateProject = useCallback(
    debounce((updatedCode: string) => {
      updateProject({
        tools: project?.tools?.map((f: any) => {
          if (f.id === tool.id) {
            return {
              ...f,
              code: updatedCode,
            };
          }
          return f;
        }),
      });
    }, 500),
    [project, tool.id, updateProject]
  );

  useEffect(() => {
    if (code !== undefined) {
      debouncedUpdateProject(code);
    }
  }, [code]);

  const onGenerateCode = async () => {
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

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="rounded overflow-hidden border h-full border-base-content/20">
        <div className="w-full h-full relative group">
          <CodeMirror
            value={code ?? ''}
            height="100%"
            theme={theme}
            extensions={[python()]}
            onChange={value => setCode(value)}
            style={{ fontSize: '0.75rem', height: '100%' }}
          />
          <div
            className={clsx(
              'absolute transition-transform ease-linear duration-300',
              {
                'right-2 bottom-2 translate-x-0 translate-y-0':
                  tool?.code !== '',
                'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2':
                  tool?.code === '',
              }
            )}
          >
            <button
              className={clsx(
                'btn gap-1',
                tool?.code ? 'btn-sm btn-outline' : 'btn-primary'
              )}
              data-tooltip-id="func-tooltip"
              data-tooltip-content={t('generate-code-tooltip')}
              onClick={onGenerateCode}
            >
              <RiMagicFill
                className={clsx('w-5 h-5', { 'animate-pulse': isGenerating })}
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
