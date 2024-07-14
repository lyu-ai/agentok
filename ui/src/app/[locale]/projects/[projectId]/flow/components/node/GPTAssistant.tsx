import React from 'react';
import { useTranslations } from 'next-intl';
import GenericNode from './GenericNode';
import ConversableAgentConfig from '../config/ConversableAgent';
import GenericOption from '../option/Option';

const GPTAssistantNode = ({ id, data, selected, ...props }: any) => {
  const t = useTranslations('node.GPTAssistant');

  return (
    <GenericNode
      id={id}
      data={data}
      selected={selected}
      nameEditable
      nodeClass="agent"
      optionsDisabled={[
        'human_input_mode',
        'disable_llm',
        'enable_code_execution',
      ]}
      ports={[{ type: 'input' }, { type: 'output' }]}
      ConfigDialog={ConversableAgentConfig}
      {...props}
      className="min-w-80"
    >
      <GenericOption
        type="text"
        rows={2}
        nodeId={id}
        data={data}
        selected={selected}
        name="instructions"
        label={t('instructions')}
        placeholder={t('instructions-placeholder')}
      />
      <GenericOption
        type="check"
        nodeId={id}
        data={data}
        selected={selected}
        label={t('use-default-instructions')}
        name="use_default_instructions"
      />
    </GenericNode>
  );
};

export default GPTAssistantNode;
