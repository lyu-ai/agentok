import React from 'react';
import { useTranslations } from 'next-intl';
import { AssistantConfig } from '../config/assistant';
import { GenericNode } from './generic-node';
import { Icons, Icon } from '@/components/icons';

export const RetrieveAssistantNode = ({
  id,
  data,
  selected,
  ...props
}: any) => {
  const iconDict: Record<string, { icon: Icon }> = {
    AssistantAgent: { icon: Icons.robot },
    GPTAssistantAgent: { icon: Icons.brain },
    CompressibleAgent: { icon: Icons.robot },
    RetrieveAssistantAgent: { icon: Icons.robot },
    MultimodalConversableAgent: { icon: Icons.eye },
    LLaVAAgent: { icon: Icons.brain },
  };

  const icon = iconDict[data.class].icon;

  const t = useTranslations('node.Assistant');

  return (
    <GenericNode
      id={id}
      nodeClass="agent"
      data={data}
      icon={icon}
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
