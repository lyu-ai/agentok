import PopupDialog from '@/components/PopupDialog';
import { GoGear, GoCopilot } from 'react-icons/go';
import clsx from 'clsx';
import { useReactFlow } from 'reactflow';
import { setNodeData } from '../../utils/flow';
import { useTranslations } from 'next-intl';

const RetrieveConfig = ({ data, setRetrieveOption, ...props }: any) => {
  const t = useTranslations('option.UserConfig');
  return (
    <div
      className={`text-sm transition-all ease-in-out ${
        data?.retrieve_config ? 'expanding-height' : 'collapsing-height'
      }`}
    >
      <div
        className={
          'flex flex-col gap-2 border rounded border-base-content/20 bg-base-content/5 p-3'
        }
      >
        <div className="flex items-center gap-2">
          <span>{t('task')}</span>
          <select
            className="select select-bordered select-sm w-24"
            value={data.retrieve_config?.task ?? 'code'}
            onChange={e => setRetrieveOption('task', e.target.value)}
          >
            <option value="code">{t('task-code')}</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span>{t('chunk-token-size')}</span>
          <input
            type="number"
            className="input input-sm input-bordered w-24"
            value={data.retrieve_config?.chunk_token_size ?? 2000}
            onChange={e =>
              setRetrieveOption('chunk_token_size', e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="shrink-0">{t('docs-path')}</span>
          <textarea
            rows={3}
            className="nodrag nowheel textarea textarea-xs textarea-bordered rounded w-full overflow-x-auto"
            value={
              data.retrieve_config?.docs_path
                ? data.retrieve_config?.docs_path.join('\n')
                : ''
            }
            onChange={e =>
              setRetrieveOption('docs_path', e.target.value.split('\n'))
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="shrink-0">{t('custom-text-types')}</span>
          <input
            type="text"
            className="input input-sm input-bordered rounded w-full"
            value={
              data.retrieve_config?.custom_text_types
                ? data.retrieve_config?.custom_text_types.join(',')
                : ''
            }
            onChange={e =>
              setRetrieveOption('custom_text_types', e.target.value.split(','))
            }
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounded"
            checked={data.retrieve_config?.get_or_create ?? false}
            onChange={e => setRetrieveOption('get_or_create', e.target.checked)}
          />
          <span>{t('get-or-create')}</span>
        </label>
        <div className="flex items-center gap-2">
          <span>{t('client')}</span>
          <select
            className="select select-bordered select-sm"
            value={data.retrieve_config?.client ?? 'code'}
            onChange={e => setRetrieveOption('client', e.target.value)}
          >
            <option value={''}>(None)</option>
            <option value={`chromadb.PersistentClient(path="/tmp/chromadb")`}>
              ChromaDB
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

const CodeExecutionConfig = ({ data, setExecutionOption, ...props }: any) => {
  const t = useTranslations('option.UserConfig');
  return (
    <div
      className={`text-sm transition-all ease-in-out ${
        data?.code_execution_config ? 'expanding-height' : 'collapsing-height'
      }`}
    >
      <div
        className={
          'flex flex-col gap-2 border rounded border-base-content/20 bg-base-content/5 p-3'
        }
      >
        <div className="flex items-center gap-2">
          <span className="shrink-0">{t('work-dir')}</span>
          <input
            type="text"
            className="input input-sm input-bordered w-full"
            value={data.code_execution_config?.work_dir ?? ''}
            onChange={e => setExecutionOption('work_dir', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span>{t('last-n-messages')}</span>
          <input
            type="number"
            className="input input-sm input-bordered w-24"
            value={data.code_execution_config?.last_n_messages ?? 0}
            onChange={e =>
              setExecutionOption('last_n_messages', e.target.valueAsNumber)
            }
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-xs"
            checked={data.code_execution_config?.use_docker}
            onChange={e => setExecutionOption('use_docker', e.target.checked)}
          />
          <span>{t('use-docker')}</span>
        </label>
      </div>
    </div>
  );
};

const UserConfig = ({ nodeId, data, className, ...props }: any) => {
  const instance = useReactFlow();
  const t = useTranslations('option.UserConfig');

  const onEnableRetrieve = (checked: boolean) => {
    if (checked) {
      setNodeData(instance, nodeId, {
        class: 'RetrieveUserProxyAgent',
        retrieve_config: {
          task: 'code',
          chunk_token_size: 2000,
          get_or_create: true,
        },
      });
    } else {
      setNodeData(instance, nodeId, {
        class: 'UserProxyAgent',
        retrieve_config: undefined,
      });
    }
  };
  const onEnableCodeExecution = (checked: boolean) => {
    if (checked) {
      setNodeData(instance, nodeId, {
        code_execution_config: {
          work_dir: 'work_dir',
        },
      });
    } else {
      setNodeData(instance, nodeId, { code_execution_config: undefined });
    }
  };
  const setRetrieveOption = (key: string, value: any) => {
    setNodeData(instance, nodeId, {
      retrieve_config: {
        ...data.retrieve_config,
        [key]: value,
      },
    });
  };
  const setExecutionOption = (key: string, value: any) => {
    setNodeData(instance, nodeId, {
      code_execution_config: {
        ...data.code_execution_config,
        [key]: value,
      },
    });
  };
  const setIsTerminationMsg = (terminationMsg: string) => {
    const formattedMsg = terminationMsg
      ? `lambda x: x.get("content", "") and x.get("content", "").rstrip().endswith("${terminationMsg}")`
      : '';
    setNodeData(instance, nodeId, { is_termination_msg: formattedMsg });
  };
  const extractTerminationMsg = (isTerminationMsg: string) => {
    const match = isTerminationMsg.match(/endswith\("([^"]+)"\)/);
    return match ? match[1] : '';
  };
  return (
    <PopupDialog
      title={
        <div className="flex items-center gap-2">
          <GoGear className="w-5 h-5" />
          <span className="text-md font-bold">{t('title')}</span>
        </div>
      }
      className={clsx(
        'flex flex-col bg-gray-800/80 backgrop-blur-md border border-gray-700 shadow-box-lg shadow-gray-700',
        className
      )}
      classNameTitle="border-b border-base-content/10"
      classNameBody="flex flex-grow flex-col w-full h-full p-2 gap-2 text-sm overflow-y-auto"
      {...props}
    >
      <div className="flex items-center justify-between">
        <span>{t('termination-msg')}</span>
        <div className="flex items-center gap-2">
          <input
            value={
              data.is_termination_msg
                ? extractTerminationMsg(data.is_termination_msg)
                : ''
            }
            onChange={e => setIsTerminationMsg(e.target.value)}
            placeholder="TERMINATE"
            className="input input-sm input-bordered rounded"
          />
          <button
            className="btn btn-sm btn-primary btn-square btn-ghost"
            onClick={() => setIsTerminationMsg('TERMINATE')}
            data-tooltip-content={'TERMINATE'}
            data-tooltip-id="default-tooltip"
          >
            <GoCopilot className="w-4 h-4" />
          </button>
        </div>
      </div>
      <label className="flex items-center justify-start cursor-pointer label gap-2">
        <input
          checked={data.code_execution_config !== undefined}
          onChange={e => onEnableCodeExecution(e.target.checked)}
          type="checkbox"
          className="checkbox checkbox-sm rounded"
        />
        <span className="font-bold">{t('code-execution')}</span>
      </label>
      <CodeExecutionConfig
        data={data}
        setExecutionOption={setExecutionOption}
      />
      <label className="flex items-center justify-start cursor-pointer label gap-2">
        <input
          checked={data.retrieve_config !== undefined}
          onChange={e => onEnableRetrieve(e.target.checked)}
          type="checkbox"
          className="checkbox checkbox-sm rounded"
        />
        <span className="font-bold">{t('support-retrieve')}</span>
      </label>
      <RetrieveConfig data={data} setRetrieveOption={setRetrieveOption} />
    </PopupDialog>
  );
};

export default UserConfig;
