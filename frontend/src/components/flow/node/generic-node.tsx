'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import {
  Handle,
  NodeProps,
  Position,
  useReactFlow,
  NodeResizer,
  HandleType,
} from 'reactflow';
import { formatData, getNodeIcon, setNodeData } from '@/lib/flow';
import { EditableText } from '@/components/editable-text';
import { GenericOption } from '../option/option';
import { useSettings } from '@/hooks';
import Tip from '@/components/tip';
import { Icon, Icons } from '@/components/icons';

interface WrapNodeProps<T = any> extends NodeProps<T> {
  children?: React.ReactNode;
  dragHandle?: string;
  nodeClass?: 'general' | 'agent' | 'group';
  className?: string;
  resizable?: boolean;
  nameEditable?: boolean;
  optionsDisabled?: string[];
  ports?: { type: HandleType; name?: string }[];
  ConfigDialog?: React.ComponentType<any>;
  optionComponent?: React.ComponentType<any>;
}

export const GenericNode = ({
  id,
  data,
  selected,
  dragHandle,
  children,
  nodeClass = 'general',
  className,
  resizable,
  nameEditable,
  optionsDisabled = [],
  ports = [],
  ConfigDialog,
  optionComponent: OptionComponent = GenericOption,
}: WrapNodeProps) => {
  const instance = useReactFlow();
  const [showConfig, setShowConfig] = useState(false);
  const { settings } = useSettings();

  const options = [
    {
      id: 'system_message',
      type: 'textarea',
      label: 'System Message',
      placeholder: 'Enter system message for the agent...',
      className: 'min-h-[100px]',
    },
    {
      id: 'description',
      type: 'textarea',
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
      type: 'switch',
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

  const NodeIcon = getNodeIcon(data.class);

  return (
    <>
      <div
        className={clsx(
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
            className={clsx(
              'w-3 h-3 rounded-full border-2 bg-base-content/10',
              'border-base-content/10 hover:border-primary',
              {
                'border-primary': selected,
              }
            )}
          />
        ))}
        <div
          className={clsx('flex items-center gap-2', dragHandle)}
          data-testid="draggable-handle"
        >
          <div className="flex items-center gap-2 flex-grow">
            <NodeIcon className="w-5 h-5" />
            {nameEditable ? (
              <EditableText
                value={data.name}
                onChange={handleNameChange}
                className="text-sm font-bold"
              />
            ) : (
              <span className="text-sm font-bold">{data.name}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {ConfigDialog && (
              <button
                type="button"
                className="btn btn-xs btn-ghost btn-square rounded"
                onClick={() => setShowConfig(true)}
                data-tooltip-id="default-tooltip"
                data-tooltip-content="Configure options"
              >
                <Icons.settings className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              className="btn btn-xs btn-ghost btn-square rounded"
              onClick={() => instance.deleteElements({ nodes: [{ id }] })}
              data-tooltip-id="default-tooltip"
              data-tooltip-content="Delete node"
            >
              <Icons.trash className="w-4 h-4" />
            </button>
          </div>
        </div>
        {children}
        {options
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
