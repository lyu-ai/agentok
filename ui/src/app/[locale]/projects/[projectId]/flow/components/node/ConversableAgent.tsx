import EditButton from '@/components/EditButton';
import EditableText from '@/components/EditableText';
import clsx from 'clsx';
import { Handle, Position, useReactFlow } from 'reactflow';
import { getNodeIcon, getNodeLabel, setNodeData } from '../../utils/flow';
import Toolbar from './Toolbar';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RiRobotFill, RiSettings3Line } from 'react-icons/ri';
import ConversableAgentConfig from '../option/ConversableAgentConfig';

const ConversableAgent = ({ id, data, selected }: any) => {
  const [showOptions, setShowOptions] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const instance = useReactFlow();
  const t = useTranslations('node.ConversableAgent');
  const tNodeMeta = useTranslations('meta.node');
  const NodeIcon = getNodeIcon(data.type, selected);

  return (
    <div
      className={clsx(
        'p-2 rounded-md border min-w-[240px] backdrop-blur-sm',
        selected
          ? 'shadow-box shadow-sky-700 bg-sky-700 border-sky-600'
          : 'border-sky-600 bg-sky-700/80'
      )}
    >
      <Toolbar
        nodeId={id}
        selected={selected}
        className="bg-sky-700 border-sky-500 p-1"
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
        <EditButton
          editing={editingName}
          setEditing={setEditingName}
          defaultLabel={t('name-edit-tooltip')}
          editingLabel={t('name-edit-done-tooltip')}
        />
      </Toolbar>
      <div className="flex flex-col w-full gap-2 text-sm">
        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <NodeIcon className="w-5 h-5" />
            <div className="text-sm font-bold">
              {getNodeLabel(data.label, tNodeMeta)}
            </div>
          </div>
          <EditableText
            text={data.name}
            onChange={(name: any) => {
              setEditingName(false);
              setNodeData(instance, id, { name: name });
            }}
            onModeChange={(editing: any) => setEditingName(editing)}
            editing={editingName}
            className="text-sm text-base-content/80 text-right"
          />
        </div>
        <div className="divider my-0" />
        <div className="flex items-center justify-between text-base-content/60 gap-2">
          <div className="text-base-content/80">{t('description')}</div>
        </div>
        <div
          className={clsx(
            'text-sm text-base-content/60 transition-all ease-in-out'
          )}
        >
          <textarea
            value={data.description ?? ''}
            onChange={e => {
              setNodeData(instance, id, { description: e.target.value });
            }}
            placeholder={t('description-placeholder')}
            className="nodrag nowheel textarea textarea-bordered w-full p-1 bg-transparent rounded"
            rows={1}
          />
        </div>
        <div className="flex items-center justify-between text-base-content/60 gap-2">
          <div className="text-base-content/80">{t('system-message')}</div>
        </div>
        <div
          className={clsx(
            'text-sm text-base-content/60 transition-all ease-in-out'
          )}
        >
          <textarea
            value={data.system_message ?? ''}
            onChange={e => {
              setNodeData(instance, id, { system_message: e.target.value });
            }}
            placeholder={t('system-message-placeholder')}
            className="nodrag nowheel textarea textarea-bordered w-full p-1 bg-transparent rounded"
            rows={2}
          />
        </div>
        <div className="flex items-center justify-between text-base-content/60 gap-2">
          <div className="text-base-content/80">{t('human-input-mode')}</div>
          <select
            className="select select-bordered select-sm bg-transparent rounded"
            value={data.human_input_mode ?? 'NEVER'}
            onChange={e => {
              setNodeData(instance, id, { human_input_mode: e.target.value });
            }}
          >
            <option value={'NEVER'}>NEVER</option>
            <option value={'ALWAYS'}>ALWAYS</option>
            <option value={'TERMINATE'}>TERMINATE</option>
          </select>
        </div>
        <div className="flex items-center text-sm justify-between gap-2">
          <div className="text-base-content/80">
            {t('max-consecutive-auto-reply')}
          </div>
          <input
            type="number"
            className="nodrag nowheel input input-bordered input-sm w-24 bg-transparent rounded"
            value={data.max_consecutive_auto_reply ?? 0}
            onChange={e => {
              setNodeData(instance, id, {
                max_consecutive_auto_reply: e.target.valueAsNumber,
              });
            }}
          />
        </div>
        <div className="flex items-center text-sm justify-between gap-2">
          <div className="text-base-content/80">{t('termination-msg')}</div>
          <input
            type="text"
            className="nodrag nowheel input input-bordered input-sm bg-transparent rounded"
            value={data.termination_msg ?? ''}
            onChange={e => {
              setNodeData(instance, id, {
                termination_msg: e.target.value,
              });
            }}
          />
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-16 !bg-sky-700"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-16 !bg-sky-700"
      />
      <ConversableAgentConfig
        show={showOptions}
        nodeId={id}
        data={data}
        onClose={() => setShowOptions(false)}
        className="flex shrink-0 w-[640px] max-w-[80vw] max-h-[90vh]"
      />
    </div>
  );
};

export default ConversableAgent;
