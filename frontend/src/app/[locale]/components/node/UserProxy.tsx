import clsx from 'clsx';
import { RiChatSmile2Fill } from 'react-icons/ri';
import { Handle, Position, useReactFlow } from 'reactflow';
import { getNodeLabel, setNodeData } from '../../utils/flow';
import Toolbar from './Toolbar';
import { useState } from 'react';
import EditButton from '@/components/EditButton';
import EditableText from '@/components/EditableText';
import UserConfig from '../option/UserConfig';
import { GoGear } from 'react-icons/go';

const UserProxyAgent = ({ id, selected, data }: any) => {
  const [editingName, setEditingName] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const instance = useReactFlow();

  return (
    <div
      className={clsx(
        'p-2  rounded-md border min-w-[240px] backdrop-blur-sm',
        selected
          ? 'shadow-box shadow-indigo-500 bg-indigo-600/80 border-indigo-500'
          : 'bg-indigo-700/90 border-indigo-600'
      )}
    >
      <div className="flex flex-col w-full gap-2 text-sm">
        <div className="w-full flex items-center justify-between gap-2 text-secondary">
          <div className="flex items-center gap-2 ">
            <RiChatSmile2Fill className="w-5 h-5" />
            <div className="text-sm font-bold">{getNodeLabel(data.class)}</div>
          </div>
          <EditableText
            text={data.name}
            onChange={(name: any) => {
              setEditingName(false);
              setNodeData(instance, id, { name: name });
            }}
            onModeChange={(editing: any) => setEditingName(editing)}
            editing={editingName}
            className="text-xs text-base-content/80 text-right"
          />
        </div>
        <Toolbar
          nodeId={id}
          selected={selected}
          className="bg-indigo-600/80 border-indigo-500"
        >
          <div
            className="cursor-pointer hover:text-white"
            onClick={() => setShowOptions(show => !show)}
            data-tooltip-content={'更多设置'}
            data-tooltip-id="default-tooltip"
            data-tooltip-place="top"
          >
            <GoGear className="w-4 h-4" />
          </div>
          <EditButton
            editing={editingName}
            setEditing={setEditingName}
            defaultLabel={'编辑节点变量名'}
            editingLabel="结束编辑"
          />
        </Toolbar>
        <div className="py-1">
          组装完成后，点击右上角
          <span className="border-2 border-green-800 text-green-700 rounded-md mx-1 p-1 font-bold">
            开始聊天
          </span>
        </div>
        <div className="divider my-0" />
        <div className="font-bold text-base-content/80">系统消息</div>
        <div className="text-xs text-base-content/60">
          <textarea
            value={data.system_message ?? ''}
            placeholder="输入指令"
            className="nodrag textarea textarea-bordered textarea-sm w-full p-1 bg-transparent rounded resize-none"
            rows={2}
            onChange={e => {
              setNodeData(instance, id, { system_message: e.target.value });
            }}
          />
        </div>
        <div className="flex items-center justify-between text-base-content/60 gap-2">
          <div className="font-bold text-base-content/80">介入模式</div>
          <select
            className="select select-bordered select-sm bg-transparent rounded"
            value={data.human_input_mode ?? 'NEVER'}
            onChange={e => {
              setNodeData(instance, id, { human_input_mode: e.target.value });
            }}
          >
            <option value={'NEVER'}>从不参与(NEVER)</option>
            <option value={'ALWAYS'}>总是参与(ALWAYS)</option>
            <option value={'TERMINATE'}>终止(TERMINATE)</option>
          </select>
        </div>
        <div className="flex items-center text-sm justify-between gap-2">
          <div className="font-bold text-base-content/80">最大重试次数</div>
          <input
            type="number"
            className="nodrag input input-bordered input-sm w-24 bg-transparent rounded"
            value={data.max_consecutive_auto_reply ?? 0}
            onChange={e => {
              setNodeData(instance, id, {
                max_consecutive_auto_reply: e.target.valueAsNumber,
              });
            }}
          />
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-16 !bg-secondary"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-16 !bg-secondary"
      />
      <UserConfig
        show={showOptions}
        nodeId={id}
        data={data}
        onClose={() => setShowOptions(false)}
        className="flex shrink-0 w-96 max-w-[80vw] max-h-[90vh]"
      />
    </div>
  );
};

export default UserProxyAgent;
