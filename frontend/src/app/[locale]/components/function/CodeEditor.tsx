import { VscDebugAlt } from 'react-icons/vsc';
import { setNodeData } from '../../utils/flow';
import { useReactFlow } from 'reactflow';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark as theme } from '@uiw/codemirror-theme-vscode';
import { RiRobot2Line } from 'react-icons/ri';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

const CodeEditor = ({ nodeId, func, ...props }: any) => {
  const t = useTranslations('function.Editor');
  const instance = useReactFlow();
  const node = instance?.getNode(nodeId);
  const onUpdateCode = (code: string) => {
    setNodeData(instance, nodeId, {
      functions: node?.data?.functions.map((f: any) => {
        if (f.id === func.id) {
          return {
            ...f,
            code,
          };
        }
        return f;
      }),
    });
  };
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="rounded overflow-hidden border h-[200px] border-base-content/20">
        <div className="w-full h-full relative group">
          <CodeMirror
            value={func?.code ?? ''}
            height="200px"
            theme={theme}
            extensions={[python()]}
            onChange={code => onUpdateCode(code)}
            style={{ fontSize: '0.75rem' }}
          />
          <div
            className={clsx(
              'absolute transition-all ease-linear duration-300',
              {
                'right-2 top-2 translate-x-0 translate-y-0': func?.code !== '',
                'right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2':
                  func?.code === '',
              }
            )}
          >
            <button
              className={clsx(
                'btn btn-outline rounded',
                func?.code ? 'btn-xs p-1' : 'btn-primary btn-sm p-2'
              )}
              data-tooltip-id="func-tooltip"
              data-tooltip-content={t('generate-code-tooltip')}
            >
              <RiRobot2Line className="w-4 h-4" />
              <span>{t('generate-code')}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button className="btn btn-sm btn-outline rounded btn-disabled">
          <VscDebugAlt className="w-4 h-4" />
          <span>{t('run-test')}</span>
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
