import PopupDialog from '@/components/PopupDialog';
import { GoGear, GoCopilot } from 'react-icons/go';
import clsx from 'clsx';
import { useReactFlow } from 'reactflow';
import { setNodeData } from '../../utils/flow';
import { useTranslations } from 'next-intl';
import { set } from 'lodash-es';

const CompressConfig = ({ data, setCompressOption, ...props }: any) => {
  const t = useTranslations('option.AssistantConfig');
  return (
    <div
      className={`text-sm transition-all ease-in-out ${
        data?.compress_config ? 'expanding-height' : 'collapsing-height'
      }`}
    >
      <div
        className={
          'flex flex-col gap-2 border rounded border-base-content/20 bg-base-content/5 p-3'
        }
      >
        <div className="flex items-center gap-2">
          <span>{t('mode')}</span>
          <select
            className="select select-bordered select-sm"
            value={data.compress_config?.mode ?? 'COMPRESS'}
            onChange={e => setCompressOption('mode', e.target.value)}
          >
            <option value="COMPRESS">COMPRESS</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span>{t('trigger_count')}</span>
          <input
            type="number"
            className="input input-sm input-bordered"
            value={data.compress_config?.trigger_count ?? 600}
            onChange={e => setCompressOption('trigger_count', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounnded"
            checked={data.compress_config?.verbose ?? false}
            onChange={e => setCompressOption('verbose', e.target.checked)}
          />
          <span>{t('verbose')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{t('leave_last_n')}</span>
          <input
            type="number"
            className="input input-sm input-bordered w-24"
            value={data.compress_config?.leave_last_n ?? 2}
            onChange={e =>
              setCompressOption('leave_last_n', e.target.valueAsNumber)
            }
          />
        </div>
      </div>
    </div>
  );
};

const ToolConfig = ({ data, setToolOption, ...props }: any) => {
  const t = useTranslations('option.AssistantConfig');
  return (
    <div
      className={`text-sm transition-all ease-in-out ${
        data?.tools ? 'expanding-height' : 'collapsing-height'
      }`}
    >
      <div
        className={
          'flex flex-col gap-2 border rounded border-base-content/20 bg-base-content/5 p-3'
        }
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounnded"
            checked={
              (data.tools &&
                data.tools.find((t: any) => t && t.type === 'retrieval')) ||
              false
            }
            onChange={e => setToolOption('retrieval', e.target.checked)}
          />
          <span>{t('retrieval')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounnded"
            checked={
              (data.tools &&
                data.tools.find(
                  (t: any) => t && t.type === 'code_interpreter'
                )) ||
              false
            }
            onChange={e => setToolOption('code_interpreter', e.target.checked)}
          />
          <span>{t('code_interpreter')}</span>
        </label>
      </div>
    </div>
  );
};

const AssistantConfig = ({ nodeId, data, className, ...props }: any) => {
  const instance = useReactFlow();
  const t = useTranslations('option.AssistantConfig');

  const onEnableCompress = (checked: boolean) => {
    if (checked) {
      setNodeData(instance, nodeId, {
        compress_config: {
          mode: 'COMPRESS',
          trigger_count: 600,
          verbose: true,
          leave_last_n: 2,
        },
        label: 'compress',
        class: 'CompressibleAgent',
      });
    } else {
      setNodeData(instance, nodeId, {
        compress_config: undefined,
        label: 'assistant',
        class: 'AssistantAgent',
      });
    }
  };
  const setCompressOption = (key: string, value: any) => {
    setNodeData(instance, nodeId, {
      compress_config: {
        ...data.compress_config,
        [key]: value,
      },
    });
  };
  const onEnableTool = (checked: boolean) => {
    if (checked) {
      setNodeData(instance, nodeId, {
        tools: [
          {
            type: 'retrieval',
          },
          {
            type: 'code_interpreter',
          },
        ],
      });
    } else {
      setNodeData(instance, nodeId, {
        tools: undefined,
      });
    }
  };
  const setToolOption = (key: string, value: any) => {
    let newTools: { type: string }[] | undefined;
    if (value) {
      if (!data.tools) {
        newTools = [{ type: key }];
      } else {
        // If 'value' is true, add a new tool if it doesn't exist
        const toolExists = data.tools.some((t: any) => t && t.type === key);
        newTools = toolExists
          ? [...data.tools]
          : [...data.tools, { type: key }];
      }
    } else {
      if (data.tools) {
        // If 'value' is false, filter out the tool
        newTools = data.tools.filter((t: any) => t && t.type !== key);
        if (newTools?.length === 0) newTools = undefined;
      }
    }
    setNodeData(instance, nodeId, { tools: newTools });
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
      {data.class !== 'GPTAssistantAgent' && (
        <>
          <label className="flex items-center justify-start cursor-pointer label gap-2">
            <input
              checked={data.compress_config !== undefined}
              onChange={e => onEnableCompress(e.target.checked ?? false)}
              type="checkbox"
              className="checkbox checkbox-sm rounded"
            />
            <span className="font-bold">{t('support_compress')}</span>
          </label>
          <CompressConfig data={data} setCompressOption={setCompressOption} />
        </>
      )}
      {data.class === 'GPTAssistantAgent' && (
        <>
          <label className="flex items-center justify-start cursor-pointer label gap-2">
            <input
              checked={data.tools !== undefined}
              disabled={data.class !== 'GPTAssistantAgent'}
              onChange={e => onEnableTool(e.target.checked ?? false)}
              type="checkbox"
              className="checkbox checkbox-sm rounded"
            />
            <span className="font-bold">{t('enable_tools')}</span>
          </label>
          <ToolConfig data={data} setToolOption={setToolOption} />
          <label className="flex items-center justify-start cursor-pointer label gap-2">
            <span className="font-bold shrink-0">{t('assistant_id')}</span>
            <input
              type="text"
              value={data.assistant_id ?? ''}
              onChange={e =>
                setNodeData(instance, nodeId, {
                  assistant_id: e.target.value,
                })
              }
              className="input input-sm input-bordered rounded w-full"
            />
          </label>
          <label className="flex w-full items-start label gap-2">
            <span className="font-bold shrink-0">{t('file_ids')}</span>
            <textarea
              value={data.file_ids?.join('\n') ?? ''}
              onChange={e =>
                setNodeData(instance, nodeId, {
                  file_ids: e.target.value.split('\n'),
                })
              }
              rows={4}
              className="textarea textarea-sm textarea-bordered w-full rounded"
            />
          </label>
        </>
      )}
    </PopupDialog>
  );
};

export default AssistantConfig;
