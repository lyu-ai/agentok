import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { GoTrash } from 'react-icons/go';
import {
  RiDeleteBin3Fill,
  RiDeleteBin3Line,
  RiDeleteBin4Line,
} from 'react-icons/ri';
import { Position, NodeToolbar, useReactFlow } from 'reactflow';

const Toolbar = ({
  nodeId,
  selected,
  hideDelete,
  children,
  className,
}: any) => {
  const reactFlowInstance = useReactFlow();
  const t = useTranslations('node.Toolbar');
  const onDelete = (e: any) => {
    e.stopPropagation();

    const node = reactFlowInstance.getNode(nodeId);
    if (!node) {
      console.warn('The node to delete does not exist', nodeId);
      return;
    }
    reactFlowInstance.deleteElements({ nodes: [node] });
  };

  return (
    <NodeToolbar
      isVisible={selected}
      position={Position.Top}
      align="end"
      className={clsx(className, 'flex items-center gap-3 p-1 rounded')}
    >
      {children}
      {!hideDelete && (
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
  );
};

export default Toolbar;
