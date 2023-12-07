import clsx from 'clsx';
import React, { memo, useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa6';
import { Handle, Position, useReactFlow } from 'reactflow';
import { IconType } from 'react-icons';
import Toolbar from './Toolbar';
import { SiOpenai } from 'react-icons/si';
import { RiRobot2Fill } from 'react-icons/ri';
import { getNodeLabel, setNodeData } from '../../utils/flow';
import EditableText from '@/components/EditableText';
import EditButton from '@/components/EditButton';
import { useTranslations } from 'next-intl';

function AssistantNode({ id, data, selected }: any) {
  const [editingName, setEditingName] = useState(false);
  const instance = useReactFlow();
  const iconDict: Record<string, IconType> = {
    GPTAssistantAgent: SiOpenai,
    AssistantAgent: RiRobot2Fill,
    RetrieveAssistantAgent: RiRobot2Fill,
    MultimodalConversableAgent: FaEye,
  };

  const NodeIcon = iconDict[data.class || 'AssistantAgent'];
  useEffect(() => {
    if (!selected) {
      setEditingName(false);
    }
  }, [selected]);

  const t = useTranslations('node.Assistant');
  const tNodeMeta = useTranslations('meta.node');

  return (
    <div
      className={clsx(
        'p-2 rounded-md border min-w-[240px] backdrop-blur-sm',
        selected
          ? 'shadow-box shadow-gray-500 bg-gray-600/90 border-gray-500'
          : 'border-gray-600 bg-gray-700/90'
      )}
    >
      <Toolbar nodeId={id} selected={selected}>
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
            <div className="text-sm font-bold">{getNodeLabel(data.label, tNodeMeta)}</div>
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
          <div className="font-bold text-base-content/80">{t('system-message')}</div>
          <div className="form-control"></div>
          <label className="flex items-center cursor-pointer label gap-2">
            <span className="label-text">{t('enable-system-message')}</span>
            <input
              id="enable_system_message"
              type="checkbox"
              className="checkbox checkbox-xs bg-transparent rounded"
              checked={data.enable_system_message ?? false}
              onChange={e => {
                setNodeData(instance, id, {
                  enable_system_message: e.target.checked,
                });
              }}
            />
          </label>
        </div>
        <div
          className={clsx(
            'text-sm text-base-content/60 transition-all ease-in-out',
            !data.enable_system_message
              ? 'collapsing-height'
              : 'expanding-height'
          )}
        >
          <textarea
            value={data.system_message ?? ''}
            onChange={e => {
              setNodeData(instance, id, { system_message: e.target.value });
            }}
            placeholder={t('system-message-placeholder')}
            className="nodrag textarea textarea-bordered w-full p-1 bg-transparent rounded"
            rows={2}
          />
        </div>
        <div className="flex items-center justify-between text-base-content/60 gap-2">
          <div className="font-bold text-base-content/80">{t('instructions')}</div>
          <div className="form-control">
            <label className="flex items-center cursor-pointer label gap-2">
              <span className="label-text">{t('instructions-use-defaults')}</span>
              <input
                id="default_instructions"
                type="checkbox"
                className="checkbox checkbox-xs bg-transparent rounded"
                checked={data.default_instructions ?? false}
                onChange={e => {
                  setNodeData(instance, id, {
                    default_instructions: e.target.checked,
                  });
                }}
              />
            </label>
          </div>
        </div>

        <div
          className={clsx(
            'text-sm text-base-content/60 transition-all',
            data.default_instructions ? 'collapsing-height' : 'expanding-height'
          )}
        >
          <textarea
            value={data.instructions ?? ''}
            onChange={e => {
              setNodeData(instance, id, { instructions: e.target.value });
            }}
            placeholder={t('instructions-placeholder')}
            className="nodrag textarea textarea-bordered w-full p-1 bg-transparent rounded resize-none"
            rows={2}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-base-content/60">
        <div className="font-bold text-base-content/80">{t('max-consecutive-auto-reply')}</div>
          <input
            type="number"
            className="input input-sm input-bordered w-14 bg-transparent px-0 rounded"
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
        type="source"
        position={Position.Right}
        className="w-16 !bg-green-600"
      />
    </div>
  );
}

export default memo(AssistantNode);
