import clsx from 'clsx';
import React from 'react';
import { useReactFlow } from 'reactflow';
import { IconType } from 'react-icons';
import {
  RiEye2Fill,
  RiEye2Line,
  RiMetaFill,
  RiMetaLine,
  RiOpenaiFill,
  RiOpenaiLine,
  RiRobot2Fill,
  RiRobot2Line,
} from 'react-icons/ri';
import { setNodeData } from '../../utils/flow';
import { useTranslations } from 'next-intl';
import LLavaOptions from '../option/LLaVaOptions';
import AssistantConfig from '../config/Assistant';
import GenericNode from './GenericNode';

const AssistantNode = ({ id, data, selected, ...props }: any) => {
  const instance = useReactFlow();
  const iconDict: Record<string, { icon: IconType; activeIcon: IconType }> = {
    AssistantAgent: { icon: RiRobot2Line, activeIcon: RiRobot2Fill },
    GPTAssistantAgent: { icon: RiOpenaiLine, activeIcon: RiOpenaiFill },
    CompressibleAgent: { icon: RiRobot2Line, activeIcon: RiRobot2Fill },
    RetrieveAssistantAgent: { icon: RiRobot2Line, activeIcon: RiRobot2Fill },
    MultimodalConversableAgent: { icon: RiEye2Line, activeIcon: RiEye2Fill },
    LLaVAAgent: { icon: RiMetaLine, activeIcon: RiMetaFill },
  };

  const icon = iconDict[data.class].icon;
  const activeIcon = iconDict[data.class].activeIcon;

  const t = useTranslations('node.Assistant');

  return (
    <GenericNode
      id={id}
      data={data}
      icon={icon}
      activeIcon={activeIcon}
      selected={selected}
      nameEditable
      options={['desription', 'system_message', 'max_consecutive_auto_reply']}
      ports={[{ type: 'input' }, { type: 'output' }]}
      ConfigDialog={AssistantConfig}
      {...props}
    >
      {data.class === 'GPTAssistantAgent' && (
        <>
          <div className="flex items-center justify-between text-base-content gap-2">
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
              className="nodrag nowheel textarea textarea-bordered text-white w-full p-1 bg-transparent rounded resize-none"
              rows={2}
            />
          </div>
        </>
      )}
      {data.class === 'LLaVAAgent' && (
        <LLavaOptions id={id} data={data} selected={selected} />
      )}
    </GenericNode>
  );
};

export default AssistantNode;
