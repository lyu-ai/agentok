import { useTranslations } from 'next-intl';
import { ConversableAgentConfig } from './conversable-agent';

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
            onChange={(e) => setRetrieveOption('task', e.target.value)}
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
            onChange={(e) =>
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
            onChange={(e) =>
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
            onChange={(e) =>
              setRetrieveOption('custom_text_types', e.target.value.split(','))
            }
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounded"
            checked={data.retrieve_config?.get_or_create ?? false}
            onChange={(e) =>
              setRetrieveOption('get_or_create', e.target.checked)
            }
          />
          <span>{t('get-or-create')}</span>
        </label>
        <div className="flex items-center gap-2">
          <span>{t('client')}</span>
          <select
            className="select select-bordered select-sm"
            value={data.retrieve_config?.client ?? 'code'}
            onChange={(e) => setRetrieveOption('client', e.target.value)}
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
            onChange={(e) => setExecutionOption('work_dir', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span>{t('last-n-messages')}</span>
          <input
            type="number"
            className="input input-sm input-bordered w-24"
            value={data.code_execution_config?.last_n_messages ?? 0}
            onChange={(e) =>
              setExecutionOption('last_n_messages', e.target.valueAsNumber)
            }
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-xs"
            checked={data.code_execution_config?.use_docker ?? false}
            onChange={(e) => setExecutionOption('use_docker', e.target.checked)}
          />
          <span>{t('use-docker')}</span>
        </label>
      </div>
    </div>
  );
};

export const UserConfig = ({ nodeId, data, className, ...props }: any) => {
  return (
    <ConversableAgentConfig
      nodeId={nodeId}
      data={data}
      className={className}
      toolScene={'execution'}
      {...props}
    />
  );
};
