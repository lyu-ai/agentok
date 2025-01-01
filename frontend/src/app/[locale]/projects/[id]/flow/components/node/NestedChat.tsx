import {
  Handle,
  NodeProps,
  NodeToolbar,
  Position,
  useReactFlow,
} from 'reactflow';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { RiDeleteBin4Line } from 'react-icons/ri';
import { getNodeIcon } from '../../utils/flow';
import { useSettings } from '@/hooks';

const NestedChat = ({ id, data, selected, ...props }: NodeProps) => {
  const t = useTranslations('node.NestedChat');
  const instance = useReactFlow();
  const nodeClass = 'group';
  const { spyModeEnabled } = useSettings();
  const onDelete = (e: any) => {
    e.stopPropagation();

    const node = instance.getNode(id);
    if (!node) {
      console.warn('The node to delete does not exist', id);
      return;
    }
    instance.deleteElements({ nodes: [node] });
  };
  const NodeIcon = getNodeIcon(data.type, selected);
  return (
    <div
      data-node-id={id}
      className={clsx(
        'p-2 rounded-lg border w-[120px] h-[120px] backdrop-blur-sm',
        {
          [`node-${nodeClass}`]: nodeClass && !selected,
          [`node-${nodeClass}-selected`]: nodeClass && selected,
        }
      )}
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
        <div
          className="cursor-pointer hover:text-white"
          data-tooltip-content={t('delete-node-tooltip')}
          data-tooltip-id="default-tooltip"
          data-tooltip-place="top"
          onClick={onDelete}
        >
          <RiDeleteBin4Line className="w-4 h-4" />
        </div>
      </NodeToolbar>
      <div className="relative flex flex-col items-center justify-center w-full h-full gap-2 text-sm">
        <NodeIcon className="w-7 h-7" />
        <span>{data.name}</span>
        {spyModeEnabled && <span className="text-opacity-50">{id}</span>}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-16 !bg-green-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-16 !bg-green-600"
      />
    </div>
  );
};

export default NestedChat;
