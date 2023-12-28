import clsx from 'clsx';
import React, { memo, useState } from 'react';
import { LuSettings2 } from 'react-icons/lu';
import { useReactFlow } from 'reactflow';
import { getNodeLabel, setNodeData } from '../../utils/flow';
import Toolbar from './Toolbar';
import { BiCollapseVertical, BiExpandVertical } from 'react-icons/bi';
import Tip from '../Tip';
import FunctionConfig from '../function/Config';
import { TbMathFunction } from 'react-icons/tb';
import { useTranslations } from 'next-intl';

function Config({ id, data, selected }: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [showFunctionConfig, setShowFunctionConfig] = useState(false);
  const instance = useReactFlow();
  const t = useTranslations('node.Config');
  const tNodeMeta = useTranslations('meta.node');

  return (
    <div
      className={clsx(
        'p-2 rounded-md border text-base-content/90 min-w-[240px] backdrop-blur-sm',
        selected
          ? 'shadow-box shadow-gray-700/80 border-gray-600/90 bg-gray-700/90'
          : 'border-gray-600/80 bg-gray-700/80'
      )}
    >
      <Toolbar
        nodeId={id}
        selected={selected}
        className="border-gray-600/90 bg-gray-700/90"
      >
        <div
          className="cursor-pointer"
          onClick={() => setCollapsed(c => !c)}
          data-tooltip-id="default-tooltip"
          data-tooltip-content={collapsed ? t('expand') : t('collapse')}
        >
          {collapsed ? (
            <BiExpandVertical className="w-4 h-4" />
          ) : (
            <BiCollapseVertical className="w-4 h-4" />
          )}
        </div>
      </Toolbar>
      <div className="flex flex-col w-full gap-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LuSettings2 className="w-5 h-5" />
            <div className="text-sm font-bold">
              {getNodeLabel(data.label, tNodeMeta)}
            </div>
          </div>
          {collapsed && <div>{data.flow_name}</div>}
        </div>
        <div
          className={clsx(
            'flex flex-col gap-2 transition-all ease-in-out delay-0',
            collapsed ? 'collapsing-height' : 'expanding-height'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="font-bold text-base-content/80">
                {t('flow-name')}
              </div>
            </div>
            <input
              className="nodrag nowheel input input-sm input-bordered w-32 bg-transparent rounded"
              value={data.flow_name ?? ''}
              onChange={e =>
                setNodeData(instance, id, { flow_name: e.target.value })
              }
            />
          </div>
          <div className="font-bold text-base-content/80">
            {t('flow-description')}
          </div>
          <textarea
            rows={2}
            className="nodrag nowheel textarea textarea-xs textarea-bordered w-full bg-transparent rounded resize-none"
            value={data.flow_description ?? ''}
            onChange={e =>
              setNodeData(instance, id, { flow_description: e.target.value })
            }
          />
        </div>
        <div className="divider my-1">{t('model-config')}</div>
        <div className="font-bold">{t('filter-dict')}</div>
        <div className="text-sm">
          <input
            className="input input-sm input-bordered w-full bg-transparent rounded"
            value={data.filter_dict ?? ''}
            onChange={e =>
              setNodeData(instance, id, { filter_dict: e.target.value })
            }
          />
        </div>
        <div className="flex items-center justify-between text-sm w-full">
          <div className="flex items-center gap-2">
            <span className="font-bold">{t('temperature')}</span>
            <Tip content={t('temperature-tooltip')} />
          </div>
          <div className="ml-2 font-bold">{data.temperature}</div>
        </div>
        <div className="flex items-center justify-between text-sm w-full">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={data.temperature ?? 0}
            onChange={e => {
              setNodeData(instance, id, {
                temperature: e.target.valueAsNumber,
              });
            }}
            className="range nodrag nowheel range-xs w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="font-bold">{t('max-tokens')}</div>
          <input
            type="number"
            className="input input-sm input-bordered w-24 bg-transparent rounded"
            defaultValue={data.max_tokens ?? 1024}
            onBlur={e => {
              setNodeData(instance, id, { max_tokens: e.target.valueAsNumber });
            }}
          />
        </div>
        <button
          className="w-full btn btn-sm btn-outline rounded"
          onClick={() => setShowFunctionConfig(c => !c)}
        >
          <TbMathFunction className="w-4 h-4" />
          <span>{t('function')}</span>
        </button>
      </div>
      <FunctionConfig
        show={showFunctionConfig}
        nodeId={id}
        data={data}
        onClose={() => setShowFunctionConfig(false)}
        className="w-[80vw] h-[80vh]"
      />
    </div>
  );
}

export default Config;
