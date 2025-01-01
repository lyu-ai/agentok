import React from 'react';
import PopupDialog from '@/components/PopupDialog';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { RiSettings3Line } from 'react-icons/ri';
import GenericOption from '../option/Option';

const ConversableAgentConfig = ({
  nodeId,
  data,
  optionsDisabled = [],
  className,
  ...props
}: any) => {
  const t = useTranslations('option.ConversableAgentConfig');
  const tGeneric = useTranslations('node.Generic');

  const GENERAL_OPTIONS = [
    {
      type: 'text',
      name: 'description',
      label: tGeneric('description'),
      placeholder: tGeneric('description-placeholder'),
      rows: 2,
    },
    {
      type: 'text',
      name: 'system_message',
      label: tGeneric('system-message'),
      placeholder: tGeneric('system-message-placeholder'),
      rows: 2,
    },
    {
      type: 'text',
      name: 'termination_msg',
      label: tGeneric('termination-msg'),
      compact: true,
    },
    {
      type: 'select',
      name: 'human_input_mode',
      label: tGeneric('human-input-mode'),
      options: [
        { value: 'NEVER', label: tGeneric('input-mode-never') },
        { value: 'ALWAYS', label: tGeneric('input-mode-always') },
        { value: 'TERMINATE', label: tGeneric('input-mode-terminate') },
      ],
      compact: true,
    },
    {
      type: 'number',
      name: 'max_consecutive_auto_reply',
      label: tGeneric('max-consecutive-auto-reply'),
    },
    {
      type: 'check',
      name: 'enable_rag',
      label: tGeneric('enable-rag'),
    },
    {
      type: 'check',
      name: 'disable_llm',
      label: tGeneric('disable-llm'),
    },
    {
      type: 'check',
      name: 'enable_code_execution',
      label: tGeneric('enable-code-execution'),
    },
  ];

  return (
    <PopupDialog
      title={
        <div className="flex items-center gap-2">
          <RiSettings3Line className="w-5 h-5" />
          <span className="text-md font-bold">
            {t('title')} - {data.name}
          </span>
        </div>
      }
      className={clsx(
        'flex flex-col bg-gray-800/80 backgrop-blur-md border border-gray-700 shadow-box-lg shadow-gray-700',
        className
      )}
      classNameTitle="border-b border-base-content/10"
      classNameBody="flex flex-1 w-full p-2 gap-2 min-h-96 max-h-[500px] text-sm overflow-y-auto"
      {...props}
    >
      <div className="flex flex-col gap-2 w-full h-full">
        {GENERAL_OPTIONS.filter((o) => !optionsDisabled.includes(o.name)).map(
          (options, index) => (
            <GenericOption
              key={index}
              nodeId={nodeId}
              data={data}
              {...options}
            />
          )
        )}
      </div>
    </PopupDialog>
  );
};

export default ConversableAgentConfig;
