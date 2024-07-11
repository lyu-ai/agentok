import { useCallback, useState } from 'react';
import {
  Handle,
  Position,
  useReactFlow,
  NodeProps,
  NodeResizer,
  NodeResizeControl,
} from 'reactflow';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Toolbar from './Toolbar';
import GroupChatConfig from '../option/GroupChatConfig';
import { RiSettings3Line } from 'react-icons/ri';
import { getNodeIcon, getNodeLabel } from '../../utils/flow';
import ResizeIcon from '@/components/ResizeIcon';

const GroupChatManager = ({ id, selected, data }: NodeProps) => {
  const t = useTranslations('node.GroupChat');
  const tNodeMeta = useTranslations('meta.node');
  const [showOptions, setShowOptions] = useState(false);
  const controlStyle = {
    background: 'transparent',
    border: 'none',
  };
  const NodeIcon = getNodeIcon(data.type, selected);

  return (
    <>
      <NodeResizer isVisible={selected} minWidth={100} minHeight={30} />
      <div
        data-node-id={id}
        className={clsx(
          'flex w-full h-full p-2 rounded-md border min-w-[480px] min-h-[600px] backdrop-blur-sm relative',
          selected
            ? 'shadow shadow-primary/80 border-primary/80 bg-primary/20'
            : 'border-primary/60 bg-primary/10'
        )}
      >
        <Toolbar nodeId={id} selected={selected} className="bg-primary/20">
          <div
            className="cursor-pointer hover:text-white"
            onClick={() => setShowOptions(show => !show)}
            data-tooltip-content={t('options')}
            data-tooltip-id="default-tooltip"
            data-tooltip-place="top"
          >
            <RiSettings3Line className="w-4 h-4" />
          </div>
        </Toolbar>
        <div className="flex flex-col w-full gap-2 text-sm">
          <div className="flex items-center gap-2 text-primary">
            <NodeIcon className="w-5 h-5" />
            <div className="text-sm font-bold">
              {data.name || getNodeLabel(data.label, tNodeMeta)}
            </div>
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          className="w-16 !bg-primary"
        />
        {selected && (
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
      <GroupChatConfig
        show={showOptions}
        onClose={() => setShowOptions(false)}
        nodeId={id}
        data={data}
        className="flex shrink-0 w-[480px] min-h-[240px] max-w-[80vw] max-h-[90vh]"
      />
    </>
  );
};

export default GroupChatManager;
