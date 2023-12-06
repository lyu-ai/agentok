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

function Config({ id, data, selected }: any) {
  const [collapsed, setCollapsed] = useState(true);
  const [showFunctionConfig, setShowFunctionConfig] = useState(false);
  const instance = useReactFlow();

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
          data-tooltip-content={collapsed ? '展开' : '收起'}
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
            <div className="text-sm font-bold">{getNodeLabel(data.class)}</div>
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
              <div className="font-bold text-base-content/80">流程名称</div>
              <Tip
                content={`流程名称用于代码生成，因此需要遵循以下规则：\n* 保证流程名称的合法性，只使用字母、数字、减号和下划线。\n* 保证流程名称的含义清晰，如**Critics**而不是**Node1**`}
              />
            </div>
            <input
              className="nodrag input input-sm input-bordered w-32 bg-transparent rounded"
              value={data.flow_id ?? ''}
              onChange={e =>
                setNodeData(instance, id, { flow_id: e.target.value })
              }
            />
          </div>
          <div className="font-bold text-base-content/80">流程描述</div>
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
        <div className="font-bold text-base-content/80">过滤条件</div>
        <div className="text-xs text-base-content/60">
          <input
            className="input input-sm input-bordered w-full bg-transparent rounded"
            value={data.filter_dict ?? ''}
            onChange={e =>
              setNodeData(instance, id, { filter_dict: e.target.value })
            }
          />
        </div>
        <div className="divider my-1">模型设置</div>
        <div className="flex items-center justify-between text-sm text-base-content/60 w-full">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base-content/80">创造性</span>
            <Tip
              content={`**温度**参数用于控制生成文本的多样性。\n值越大，生成的内容创造性越强，但是越容易出现不合理的文本。`}
            />
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
        <div className="font-bold text-base-content/80">消息长度</div>
        <div className="text-xs text-base-content/60">
          <input
            type="number"
            className="input input-sm input-bordered w-full bg-transparent rounded"
            value={data.max_tokens ?? 1024}
            onChange={e => {
              setNodeData(instance, id, { max_tokens: e.target.valueAsNumber });
            }}
          />
        </div>
        <div className="flex items-center justify-between text-base-content/60 gap-2">
          <div className="font-bold text-base-content/80">自定义函数</div>
          <div className="form-control">
            <button
              className="btn btn-xs btn-outline rounded"
              onClick={() => setShowFunctionConfig(c => !c)}
            >
              <TbMathFunction className="w-4 h-4" />
              <span>设置</span>
            </button>
          </div>
        </div>
      </div>
      <FunctionConfig
        show={showFunctionConfig}
        nodeId={id}
        data={data}
        onClose={() => setShowFunctionConfig(false)}
        className="min-w-[80vw] w-[80vw] max-w-[90vw] min-h-[80vh] max-h-[90vh]"
      />
    </div>
  );
}

export default Config;
