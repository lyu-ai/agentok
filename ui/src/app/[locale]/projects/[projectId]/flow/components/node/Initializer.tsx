import clsx from 'clsx';
import { Handle, Position, useReactFlow } from 'reactflow';
import { getNodeLabel, setNodeData } from '../../utils/flow';
import Toolbar from './Toolbar';
import { useTranslations } from 'next-intl';
import { RiSettings3Line, RiUserVoiceFill } from 'react-icons/ri';
import Tip from '@/components/Tip';
import { isArray } from 'lodash-es';
import { useState } from 'react';
import InitializerConfig from '../option/IntializerConfig';

const Initializer = ({ id, selected, data }: any) => {
  const [showOptions, setShowOptions] = useState(false);
  const instance = useReactFlow();
  const t = useTranslations('node.Initializer');
  const tNodeMeta = useTranslations('meta.node');
  return (
    <div
      className={clsx(
        'p-2 rounded-md border backdrop-blur-sm min-w-[240px]',
        selected
          ? 'shadow-box shadow-gray-700/80 border-gray-600/90 bg-gray-700/90'
          : 'border-gray-600/80 bg-gray-700/80'
      )}
    >
      <Toolbar
        nodeId={id}
        selected={selected}
        className="shadow-box shadow-gray-700/80 border-gray-600/90 bg-gray-700/90"
      >
        <div
          className="cursor-pointer hover:text-white"
          onClick={() => setShowOptions(show => !show)}
          data-tooltip-content={t('options')}
          data-tooltip-id="default-tooltip"
          data-tooltip-place="top"
        >
          <RiSettings3Line className="w-4 h-4" />
        </div>
      </Toolbar>
      <div className="flex flex-col w-full gap-2 text-sm">
        <div className="flex items-center gap-2 text-primary">
          <RiUserVoiceFill className="w-5 h-5" />
          <div className="text-sm font-bold">
            {getNodeLabel(data.label, tNodeMeta)}
          </div>
        </div>
        <div className="py-1 text-sm">{t('initializer-tooltip')}</div>
        <div className="divider my-0" />
        <div className="text-base-content/80 flex items-center gap-1">
          {t('sample-messages')}
          <Tip content={t('sample-messages-tooltip')} />
        </div>
        <textarea
          rows={2}
          className="nodrag nowheel textarea textarea-xs textarea-bordered w-full bg-transparent rounded"
          value={
            data.sample_messages
              ? isArray(data.sample_messages)
                ? data.sample_messages.join('\n')
                : data.sample_messages
              : ''
          }
          onChange={e =>
            setNodeData(instance, id, {
              sample_messages: e.target.value.split('\n'),
            })
          }
        />
        <div className="flex items-center justify-between text-sm gap-2 w-full">
          <div className="whitespace-nowrap text-base-content/80">
            {`${t('max-turns')} - [${data.max_turns ?? 'None'}]`}
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={data.max_turns ?? 0}
            onChange={e => {
              setNodeData(instance, id, {
                max_turns:
                  e.target.valueAsNumber === 0 ? null : e.target.valueAsNumber,
              });
            }}
            className="range nodrag nowheel range-xs w-full"
          />
        </div>
        <div className="flex items-center justify-between text-base-content/60 gap-2">
          <div className="text-base-content/80">{t('summary-method')}</div>
          <select
            className="select select-bordered select-sm bg-transparent rounded"
            value={data.summary_method ?? 'last_msg'}
            onChange={e => {
              setNodeData(instance, id, { summary_method: e.target.value });
            }}
          >
            <option value={'last_msg'}>Last Message</option>
            <option value={'reflection_with_llm'}>Reflection with LLM</option>
          </select>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-16 !bg-primary"
      />
      <InitializerConfig
        show={showOptions}
        nodeId={id}
        data={data}
        onClose={() => setShowOptions(false)}
        className="flex shrink-0 w-[640px] max-w-[80vw] max-h-[90vh]"
      />
    </div>
  );
};

export default Initializer;
