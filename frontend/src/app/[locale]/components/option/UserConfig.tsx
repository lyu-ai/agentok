import PopupDialog from '@/components/PopupDialog';
import { GoGear } from 'react-icons/go';
import clsx from 'clsx';
import { useReactFlow } from 'reactflow';
import { setNodeData } from '../../utils/flow';

const RetrieveConfig = ({ data, setRetrieveOption, ...props }: any) => {
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
          <span>任务类型</span>
          <select
            className="select select-bordered select-sm w-24"
            value={data.retrieve_config?.task ?? 'code'}
            onChange={e => setRetrieveOption('task', e.target.value)}
          >
            <option value="code">代码</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span>分块尺寸</span>
          <input
            type="number"
            className="input input-sm input-bordered w-24"
            value={data.retrieve_config?.chunk_token_size ?? 2000}
            onChange={e =>
              setRetrieveOption('chunk_token_size', e.target.value)
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="shrink-0">文档路径</span>
          <input
            type="text"
            className="input input-sm input-bordered w-full"
            value={data.retrieve_config?.docs_path ?? 20}
            onChange={e => setRetrieveOption('docs_path', e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-xs"
            checked={data.retrieve_config?.get_or_create ?? false}
            onChange={e => setRetrieveOption('get_or_create', e.target.checked)}
          />
          <span>不存在则自动创建</span>
        </label>
        <div className="flex items-center gap-2">
          <span>存储引擎</span>
          <select
            className="select select-bordered select-sm w-24"
            value={data.retrieve_config?.client ?? 'code'}
            onChange={e => setRetrieveOption('client', e.target.value)}
          >
            <option value={`chromadb.PersistentClient(path="/tmp/chromadb")`}>
              chromadb
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

const CodeExecutionConfig = ({ data, setExecutionOption, ...props }: any) => {
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
          <span className="shrink-0">代码路径</span>
          <input
            type="text"
            className="input input-sm input-bordered w-full"
            value={data.code_execution_config?.work_dir ?? ''}
            onChange={e => setExecutionOption('work_dir', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span>附带消息条数</span>
          <input
            type="number"
            className="input input-sm input-bordered w-24"
            value={data.retrieve_config?.last_n_messages ?? 0}
            onChange={e =>
              setExecutionOption('last_n_messages', e.target.value)
            }
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-xs"
            checked={data.retrieve_config?.use_docker}
            onChange={e => setExecutionOption('use_docker', e.target.value)}
          />
          <span>使用 Docker</span>
        </label>
      </div>
    </div>
  );
};

const UserConfig = ({ nodeId, data, className, ...props }: any) => {
  const instance = useReactFlow();
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
  return (
    <PopupDialog
      title={
        <div className="flex items-center gap-2">
          <GoGear className="w-6 h-6" />
          <span className="text-md font-bold">更多选项</span>
        </div>
      }
      className={clsx(
        'flex flex-col bg-gray-800/80 backgrop-blur-md border border-gray-700 shadow-box-lg shadow-gray-700',
        className
      )}
      classNameTitle="border-b border-base-content/10"
      classNameBody="flex flex-grow flex-col w-full h-full p-2 gap-2 text-sm"
      {...props}
    >
      <label className="flex items-center justify-start cursor-pointer label gap-2">
        <input
          checked={data.retrieve_config !== undefined}
          onChange={e => onEnableRetrieve(e.target.checked)}
          type="checkbox"
          className="checkbox checkbox-sm"
        />
        <span className="font-bold">启用知识库（RAG）</span>
      </label>
      <RetrieveConfig data={data} setRetrieveOption={setRetrieveOption} />
      <label className="flex items-center justify-start cursor-pointer label gap-2">
        <input
          checked={data.code_execution_config !== undefined}
          onChange={e => onEnableCodeExecution(e.target.checked)}
          type="checkbox"
          className="checkbox checkbox-sm"
        />
        <span className="font-bold">代码执行</span>
      </label>
      <CodeExecutionConfig
        data={data}
        setExecutionOption={setExecutionOption}
      />
    </PopupDialog>
  );
};

export default UserConfig;
