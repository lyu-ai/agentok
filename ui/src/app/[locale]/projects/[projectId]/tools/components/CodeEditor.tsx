import { VscDebugAlt } from 'react-icons/vsc';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark as theme } from '@uiw/codemirror-theme-vscode';
import { RiMagicFill } from 'react-icons/ri';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useProject } from '@/hooks';

const CodeEditor = ({ projectId, tool, ...props }: any) => {
  const t = useTranslations('tool.Editor');
  const [isGenerating, setIsGenerating] = useState(false);
  const { project, updateProject } = useProject(projectId);
  const onUpdateCode = (code: string) => {
    updateProject({
      tools: project?.tools?.map((f: any) => {
        if (f.id === tool.id) {
          return {
            ...f,
            code,
          };
        }
        return f;
      }),
    });
  };
  const onGenerateCode = async () => {
    setIsGenerating(true);
    await fetch('/api/codegen/tool', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(tool),
    })
      .then(async res => {
        if (res.ok) {
          const generatedFunc = await res.json();
          onUpdateCode(generatedFunc.code);
        }
      })
      .finally(() => setIsGenerating(false));
  };
  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="rounded overflow-hidden border h-full border-base-content/20">
        <div className="w-full h-full relative group">
          <CodeMirror
            value={tool?.code ?? ''}
            height="100%"
            theme={theme}
            extensions={[python()]}
            onChange={code => onUpdateCode(code)}
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
                className={clsx('w-5 h-5', { 'animate-spin': isGenerating })}
              />
              <span>{t('generate-code')}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-=0">
        <button className="btn btn-sm btn-outline rounded btn-disabled">
          <VscDebugAlt className="w-4 h-4" />
          <span>{t('run-test')}</span>
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
