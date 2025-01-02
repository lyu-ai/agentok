'use client';

import { useCallback, useState } from 'react';
import {
  Handle,
  Position,
  useReactFlow,
  NodeResizer,
  HandleType,
  NodeProps,
} from '@xyflow/react';
import { getNodeIcon, setNodeData } from '@/lib/flow';
import { EditableText } from '@/components/editable-text';
import { GenericOption } from '../option/option';
import { useSettings } from '@/hooks';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type WrapNodeProps = NodeProps & {
  children?: React.ReactNode;
  nodeClass?: 'general' | 'agent' | 'group';
  className?: string;
  resizable?: boolean;
  nameEditable?: boolean;
  options?: string[];
  optionsDisabled?: string[];
  ports?: { type: HandleType; name?: string }[];
  ConfigDialog?: React.ComponentType<any>;
  optionComponent?: React.ComponentType<any>;
};

export const GenericNode = ({
  id,
  data,
  selected,
  children,
  nodeClass = 'general',
  className,
  resizable,
  nameEditable,
  options = [],
  optionsDisabled = [],
  ports = [],
  ConfigDialog,
  optionComponent: OptionComponent = GenericOption,
}: WrapNodeProps) => {
  const instance = useReactFlow();
  const [showConfig, setShowConfig] = useState(false);
  const { settings } = useSettings();

  const defaultOptions = [
    {
      id: 'system_message',
      type: 'text',
      label: 'System Message',
      placeholder: 'Enter system message for the agent...',
      className: 'min-h-[100px]',
    },
    {
      id: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Enter description for the agent...',
      className: 'min-h-[100px]',
    },
    {
      id: 'termination_msg',
      type: 'text',
      label: 'Termination Message',
    },
    {
      id: 'human_input_mode',
      type: 'select',
      label: 'Human Input Mode',
      options: [
        { value: 'NEVER', label: 'Never' },
        { value: 'ALWAYS', label: 'Always' },
        { value: 'TERMINATE', label: 'On Terminate' },
      ],
    },
    {
      id: 'max_consecutive_auto_reply',
      type: 'number',
      label: 'Max Consecutive Auto Reply',
      min: 1,
      max: 100,
    },
    {
      id: 'disable_llm',
      type: 'check',
      label: 'Disable LLM',
    },
  ];

  const handleNameChange = useCallback(
    (name: string) => {
      setNodeData(instance, id, { name });
    },
    [instance, id]
  );

  const handleDataChange = useCallback(
    (key: string, value: any) => {
      setNodeData(instance, id, { [key]: value });
    },
    [instance, id]
  );

  const NodeIcon = getNodeIcon(data.class as string);

  return (
    <>
      <div
        className={cn(
          'group relative flex flex-col gap-2 p-4 rounded-xl border shadow-box',
          'bg-base-content/10 border-base-content/10',
          'hover:border-primary/40',
          {
            'border-primary': selected,
            'min-w-[320px]': !className?.includes('min-w-'),
          },
          className
        )}
      >
        {resizable && selected && (
          <NodeResizer
            color="#2563eb"
            isVisible={selected}
            minWidth={200}
            minHeight={100}
          />
        )}
        {ports.map(({ type, name }, i) => (
          <Handle
            key={i}
            type={type}
            position={type === 'target' ? Position.Left : Position.Right}
            id={name}
            className={cn(
              'w-3 h-3 rounded-full border-2 bg-base-content/10',
              'border-base-content/10 hover:border-primary',
              {
                'border-primary': selected,
              }
            )}
          />
        ))}
        <div className={cn('flex items-center gap-2')}>
          <div className="flex items-center gap-2 flex-grow">
            <NodeIcon className="w-5 h-5" />
            {nameEditable ? (
              <EditableText
                value={data.name}
                onChange={handleNameChange}
                className="text-sm font-bold"
              />
            ) : (
              <span className="text-sm font-bold">{data.name as string}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {ConfigDialog && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowConfig(true)}
                data-tooltip-id="default-tooltip"
                data-tooltip-content="Configure options"
              >
                <Icons.settings className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => instance.deleteElements({ nodes: [{ id }] })}
              data-tooltip-id="default-tooltip"
              data-tooltip-content="Delete node"
            >
              <Icons.trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {children}
        {defaultOptions
          .filter((option) => !optionsDisabled.includes(option.id))
          .map((option) => (
            <OptionComponent
              key={option.id}
              nodeId={id}
              data={data}
              selected={selected}
              {...option}
              onChange={(value: any) => handleDataChange(option.id, value)}
            />
          ))}
      </div>
      {ConfigDialog && (
        <ConfigDialog
          show={showConfig}
          onClose={() => setShowConfig(false)}
          nodeId={id}
          data={data}
          settings={settings}
        />
      )}
    </>
  );
};
