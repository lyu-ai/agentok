import clsx from 'clsx';
import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {
  Handle,
  NodeResizeControl,
  NodeProps,
  Position,
  useReactFlow,
  NodeToolbar,
} from 'reactflow';
import { formatData, getNodeIcon, setNodeData } from '../../utils/flow';
import EditableText from '@/components/EditableText';
import { useTranslations } from 'next-intl';
import { RiDeleteBin4Line, RiSettings3Line } from 'react-icons/ri';
import ResizeIcon from '@/components/ResizeIcon';
import Option from '../option/Option';
import { useSettings } from '@/hooks';
import Tip from '@/components/Tip';

type Props = {
  id: string;
  data: any;
  icon?: any;
  activeIcon?: any;
  nodeClass?: 'general' | 'agent' | 'group'; // predefined style class of the node, such as 'primary' or 'sky-300'
  nameEditable?: boolean;
  deletable?: boolean;
  resizable?: boolean;
  toolbarButtons?: ReactNode[];
  options?: any[];
  ports?: any[];
  ConfigDialog?: any;
  selected: boolean;
  className?: string;
} & NodeProps &
  React.HTMLAttributes<HTMLDivElement>;

const GenericNode = ({
  id,
  data,
  selected,
  icon,
  activeIcon,
  nodeClass = 'general',
  nameEditable,
  deletable,
  resizable,
  toolbarButtons,
  options = [], // a list of common options
  ports = [], // a list of common ports [{ type: 'input', name: '' }, { type: 'output', name: 'handle1' }, ...]
  ConfigDialog,
  className,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const [editingName, setEditingName] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const controlStyle = {
    background: 'transparent',
    border: 'none',
  };
  const instance = useReactFlow();
  const { spyModeEnabled } = useSettings();
  let NodeIcon;
  if (selected && activeIcon) {
    NodeIcon = activeIcon;
  } else if (icon) {
    NodeIcon = icon;
  } else {
    NodeIcon = getNodeIcon(data.type, selected);
  }
  const t = useTranslations('node.Generic');
  const COMMON_OPTIONS = [
    {
      type: 'text',
      name: 'system_message',
      label: t('system-message'),
      placeholder: t('system-message-placeholder'),
      rows: 2,
    },
    {
      type: 'text',
      name: 'description',
      label: t('description'),
      placeholder: t('description-placeholder'),
      rows: 2,
    },
    {
      type: 'text',
      name: 'termination_msg',
      label: t('termination-msg'),
      compact: true,
    },
    {
      type: 'select',
      name: 'human_input_mode',
      label: t('human-input-mode'),
      options: [
        { value: 'NEVER', label: t('input-mode-never') },
        { value: 'ALWAYS', label: t('input-mode-always') },
        { value: 'TERMINATE', label: t('input-mode-terminate') },
      ],
      compact: true,
    },
    {
      type: 'number',
      name: 'max_consecutive_auto_reply',
      label: t('max-consecutive-auto-reply'),
    },
  ];

  useEffect(() => {
    if (!selected) {
      setEditingName(false);
    }
  }, [selected]);

  // Utility type to extract properties from T that exist in U
  type ExtractProps<T, U> = {
    [K in keyof T & keyof U]: T[K];
  };
  // Filter the props at runtime
  const filterProps = <T, U extends object>(
    props: T,
    type: U
  ): ExtractProps<T, U> => {
    const result = {} as ExtractProps<T, U>;
    for (const key in props) {
      if (key in type) {
        (result as any)[key] = props[key];
      }
    }
    return result;
  };

  const divProps = filterProps(
    props,
    {} as React.HTMLAttributes<HTMLDivElement>
  );

  const onDelete = (e: any) => {
    e.stopPropagation();

    const node = instance.getNode(id);
    if (!node) {
      console.warn('The node to delete does not exist', id);
      return;
    }
    instance.deleteElements({ nodes: [node] });
  };

  return (
    <div
      data-node-id={id}
      className={clsx(
        'p-2 rounded-md border min-w-[240px] backdrop-blur-sm w-full h-full',
        {
          [`node-${nodeClass}`]: nodeClass && !selected,
          [`node-${nodeClass}-selected`]: nodeClass && selected,
        },
        className
      )}
      {...divProps}
    >
      <NodeToolbar
        nodeId={id}
        isVisible={selected}
        position={Position.Top}
        align="end"
        className={clsx(
          `node-${nodeClass}-selected`,
          'flex items-center gap-3 py-1 px-2 border rounded'
        )}
      >
        {toolbarButtons}
        {ConfigDialog && (
          <div
            className="cursor-pointer hover:text-white"
            onClick={() => setShowOptions(show => !show)}
            data-tooltip-content={t('options')}
            data-tooltip-id="default-tooltip"
            data-tooltip-place="top"
          >
            <RiSettings3Line className="w-4 h-4" />
          </div>
        )}
        {!deletable && (
          <div
            className="cursor-pointer hover:text-white"
            data-tooltip-content={t('delete-node-tooltip')}
            data-tooltip-id="default-tooltip"
            data-tooltip-place="top"
            onClick={onDelete}
          >
            <RiDeleteBin4Line className="w-4 h-4" />
          </div>
        )}
      </NodeToolbar>
      <div className="relative flex flex-col w-full gap-2 text-sm">
        <div className="flex items-center gap-1 justify-between">
          <div className="w-full flex items-center gap-1">
            <NodeIcon className="w-5 h-5" />
            <EditableText
              text={data.name}
              onChange={(name: any) => {
                setEditingName(false);
                setNodeData(instance, id, { name: name });
              }}
              onModeChange={(editing: any) => setEditingName(editing)}
              editing={editingName}
              showButtons={nameEditable}
              className="text-sm font-bold"
            />
          </div>
          {spyModeEnabled && (
            <Tip icon={<span>{id}</span>} content={formatData(data)} />
          )}
        </div>
        {options.map((option, index) => {
          const commonOption = COMMON_OPTIONS.find(o => o.name === option);
          if (commonOption) {
            return (
              <Option
                key={index}
                nodeId={id}
                data={data}
                {...commonOption}
                className="flex items-center justify-between gap-2"
              />
            );
          }
        })}
        {children}
      </div>

      {ports.map((port, index) => (
        <Handle
          key={index}
          type={port.type === 'input' ? 'target' : 'source'}
          position={port.type === 'input' ? Position.Left : Position.Right}
          id={port.name}
          className="w-16 !bg-green-600"
        />
      ))}

      {ConfigDialog && (
        <ConfigDialog
          show={showOptions}
          nodeId={id}
          data={data}
          onClose={() => setShowOptions(false)}
          className="flex shrink-0 w-[640px] max-w-[80vw] max-h-[90vh]"
        />
      )}
      {selected && resizable && (
        <NodeResizeControl
          className="custom-resize-handle"
          style={controlStyle}
          minWidth={100}
          minHeight={50}
        >
          <ResizeIcon />
        </NodeResizeControl>
      )}
    </div>
  );
};

export default GenericNode;
