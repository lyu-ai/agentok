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
          ? 'shadow-box shadow-gray-500 bg-gray-600/90 border-gray-500'
          : 'border-gray-600 bg-gray-700/90'
      )}
    >
      <Toolbar nodeId={id} selected={selected} hideDelete>
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
          {collapsed && <div>{data.flow_id}</div>}
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
              <Tip content={t('flow-name-tooltip')} />
            </div>
            <input
              className="nodrag input input-sm input-bordered w-32 bg-transparent rounded"
              value={data.flow_id ?? ''}
              onChange={e =>
                setNodeData(instance, id, { flow_id: e.target.value })
              }
            />
          </div>
          <div className="font-bold text-base-content/80">
            {t('flow-description')}
          </div>
          <textarea
            rows={2}
            className="nodrag textarea textarea-sm textarea-bordered w-full bg-transparent rounded resize-none"
            value={data.flow_description ?? ''}
            onChange={e =>
              setNodeData(instance, id, { flow_description: e.target.value })
            }
          />
        </div>
        <div className="divider my-0" />
        <div className="font-bold text-base-content/80">{t('filter-dict')}</div>
        <div className="text-sm text-base-content/60">
          <input
            className="input input-sm input-bordered w-full bg-transparent rounded"
            value={data.filter_dict ?? ''}
            onChange={e =>
              setNodeData(instance, id, { filter_dict: e.target.value })
            }
          />
        </div>
        <div className="divider my-1">{t('model-config')}</div>
        <div className="flex items-center justify-between text-sm text-base-content/60 w-full">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base-content/80">
              {t('temperature')}
            </span>
            <Tip content={t('temperature-tooltip')} />
          </div>
          <div className="ml-2 font-bold">{data.temperature}</div>
        </div>
        <div className="flex items-center justify-between text-sm text-base-content/60 w-full">
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
            className="range nodrag range-xs w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-base-content/60">
          <div className="font-bold text-base-content/80">
            {t('max-tokens')}
          </div>
          <input
            type="number"
            className="input input-sm input-bordered w-24 bg-transparent rounded"
            value={data.max_tokens ?? 1024}
            onChange={e => {
              setNodeData(instance, id, { max_tokens: e.target.valueAsNumber });
            }}
          />
        </div>
        <div className="flex items-center justify-end w-full text-base-content/60 gap-2">
          <button
            className="w-full btn btn-sm btn-outline rounded"
            onClick={() => setShowFunctionConfig(c => !c)}
          >
            <TbMathFunction className="w-4 h-4" />
            <span>{t('function')}</span>
          </button>
        </div>
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
