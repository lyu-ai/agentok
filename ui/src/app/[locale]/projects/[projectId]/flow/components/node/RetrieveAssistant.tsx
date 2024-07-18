import React from 'react';
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
import { useTranslations } from 'next-intl';
import AssistantConfig from '../config/Assistant';
import GenericNode from './GenericNode';

const RetrieveAssistantNode = ({ id, data, selected, ...props }: any) => {
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
      nodeClass="agent"
      data={data}
      icon={icon}
      activeIcon={activeIcon}
      selected={selected}
      nameEditable
      options={['desription', 'system_message', 'max_consecutive_auto_reply']}
      optionsDisabled={['human_input_mode', 'disable_llm']}
      ports={[{ type: 'input' }, { type: 'output' }]}
      ConfigDialog={AssistantConfig}
      {...props}
    ></GenericNode>
  );
};

export default RetrieveAssistantNode;
