import PopupDialog from '@/components/PopupDialog';
import { GoGear, GoCopilot } from 'react-icons/go';
import clsx from 'clsx';
import { useReactFlow } from 'reactflow';
import { setNodeData } from '../../utils/flow';
import { useTranslations } from 'next-intl';

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
    </PopupDialog>
  );
};

export default AssistantConfig;
