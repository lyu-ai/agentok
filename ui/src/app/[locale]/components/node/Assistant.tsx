import clsx from 'clsx';
import React, { memo, useEffect, useState } from 'react';
import { FaEye, FaMeta } from 'react-icons/fa6';
import { GoGear } from 'react-icons/go';
import { Handle, useReactFlow } from 'reactflow';
import { IconType } from 'react-icons';
import Toolbar from './Toolbar';
import { TbBrandOpenai } from 'react-icons/tb';
import { RiRobot2Fill } from 'react-icons/ri';
import { getNodeLabel, setNodeData } from '../../utils/flow';
import EditableText from '@/components/EditableText';
import EditButton from '@/components/EditButton';
import { useTranslations } from 'next-intl';
import LLavaOptions from '../option/LLaVaOptions';
import AssistantConfig from '../option/AssistantConfig';

function AssistantNode({ id, data, selected }: any) {
  const [editingName, setEditingName] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const instance = useReactFlow();
  const iconDict: Record<string, IconType> = {
    GPTAssistantAgent: TbBrandOpenai,
    AssistantAgent: RiRobot2Fill,
    CompressibleAgent: RiRobot2Fill,
    RetrieveAssistantAgent: RiRobot2Fill,
    MultimodalConversableAgent: FaEye,
    LLaVAAgent: FaMeta,
  };

  const NodeIcon = iconDict[data.class ?? 'AssistantAgent'];
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
          ? 'shadow-box shadow-lime-700 bg-lime-700 border-lime-600'
          : 'border-lime-600 bg-lime-700/80'
      )}
    >
      <Toolbar
        nodeId={id}
        selected={selected}
        className="bg-lime-700 border-lime-600"
      >
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
          <div className="font-bold text-base-content/80">
            {t('system-message')}
          </div>
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
        {data.class === 'GPTAssistantAgent' && (
          <>
            <div className="flex items-center justify-between text-base-content/60 gap-2">
              <div className="flex items-center gap-2 font-bold text-base-content/80">
                {t('instructions')}
              </div>
              <div className="form-control">
                <label className="flex items-center cursor-pointer label gap-2">
                  <span className="label-text text-xs">
                    {t('instructions-use-defaults')}
                  </span>
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
                !data.default_instructions
                  ? 'expanding-height'
                  : 'collapsing-height'
              )}
            >
              <textarea
                value={data.instructions ?? ''}
                onChange={e => {
                  setNodeData(instance, id, { instructions: e.target.value });
                }}
                placeholder={t('instructions-placeholder')}
                className="nodrag nowheel textarea textarea-bordered w-full p-1 bg-transparent rounded resize-none"
                rows={2}
              />
            </div>
          </>
        )}
        <div className="flex items-center justify-between text-sm text-base-content/60 gap-2">
          <div className="font-bold text-base-content/80">
            {t('max-consecutive-auto-reply')}
          </div>
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
        {data.class === 'LLaVAAgent' && (
          <LLavaOptions id={id} data={data} selected={selected} />
        )}
        {['AssistantAgent', 'CompressibleAgent', 'GPTAssistantAgent'].includes(
          data.class
        ) && (
          <button
            className="btn btn-outline btn-sm flex items-center gap-2 rounded"
            onClick={() => setShowOptions(o => !o)}
          >
            <GoGear className="w-4 h-4" />
            <span>{t('options')}</span>
          </button>
        )}
      </div>

      <Handle type="source" position={'right'} className="w-16 !bg-green-600" />

      <AssistantConfig
        show={showOptions}
        nodeId={id}
        data={data}
        onClose={() => setShowOptions(false)}
        className="flex shrink-0 w-[640px] max-w-[80vw] max-h-[90vh]"
      />
    </div>
  );
}

export default memo(AssistantNode);
