import { useReactFlow } from 'reactflow';
import { setEdgeData, setNodeData } from '../../utils/flow';
import { useTranslations } from 'next-intl';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { RiChatSettingsFill, RiChatSettingsLine } from 'react-icons/ri';

const ConversePanel = ({ edgeId, data, ...props }: any) => {
  const t = useTranslations('option.ConverseConfig');
  const instance = useReactFlow();
  return (
    <div className="z-50 flex flex-col gap-2 w-full h-full nodrag nowheel text-sm">
      <div className="flex items-center gap-2">
        <RiChatSettingsFill className="w-5 h-5" />
        <div className="font-bold">{t('title')}</div>
      </div>
      <div className="text-xs">{t('description')}</div>
      <div className="text-sm font-bold">{t('message')}</div>
      <textarea
        className="textarea textarea-bordered textarea-xs rounded w-full"
        value={data?.message ?? ''}
        onChange={e => {
          setEdgeData(instance, edgeId, { message: e.target.value });
        }}
      />
      <div className="text-sm font-bold">{t('summary-prompt')}</div>
      <textarea
        className="textarea textarea-bordered textarea-xs rounded w-full"
        value={data?.summary_prompt ?? ''}
        onChange={e => {
          setEdgeData(instance, edgeId, { summary_prompt: e.target.value });
        }}
      />
      <div className="flex items-center justify-between text-sm gap-2 w-full">
        <div className="whitespace-nowrap text-base-content/80 w-48">
          {`${t('max-turns')} - [${data?.max_turns ?? 'None'}]`}
        </div>
        <input
          type="range"
          min="0"
          max="50"
          step="1"
          value={data?.max_turns ?? 0}
          onChange={e => {
            setEdgeData(instance, edgeId, {
              max_turns:
                e.target.valueAsNumber === 0 ? null : e.target.valueAsNumber,
            });
          }}
          className="range range-xs w-full nodrag"
        />
      </div>
      <div className="flex items-center justify-between text-sm text-base-content/60 gap-2">
        <div className="text-base-content/80">{t('summary-method')}</div>
        <select
          className="select select-bordered select-sm bg-transparent rounded nodrag"
          value={data?.summary_method ?? 'last_msg'}
          onChange={e => {
            setEdgeData(instance, edgeId, { summary_method: e.target.value });
          }}
        >
          <option value={'last_msg'}>Last Message</option>
          <option value={'reflection_with_llm'}>Reflection with LLM</option>
        </select>
      </div>
    </div>
  );
};

const ConverseConfig = ({ edgeId, data, className, style, ...props }: any) => {
  const instance = useReactFlow();
  const t = useTranslations('option.ConverseConfig');

  return (
    <Popover className="relative nodrag nowheel">
      <PopoverButton style={style} className={className}>
        <div
          className="btn btn-sm btn-circle btn-primary flex items-center gap-2"
          data-tooltip-id='default-tooltip'
          data-tooltip-content={'Config the conversation between two agents'}
        >
          <RiChatSettingsLine className="w-5 h-5" />
        </div>
      </PopoverButton>
      <PopoverPanel
        anchor="top start"
        className="fixed origin-bottom-left rounded-lg backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600 max-w-96 p-3"
      >
        <ConversePanel edgeId={edgeId} data={data} />
      </PopoverPanel>
    </Popover>
  );
};

export default ConverseConfig;
