import clsx from 'clsx';
import { Handle, Position, useReactFlow } from 'reactflow';
import { getNodeIcon, getNodeLabel, setNodeData } from '../../utils/flow';
import Toolbar from './Toolbar';
import { useTranslations } from 'next-intl';
import Tip from '@/components/Tip';
import { isArray } from 'lodash-es';

const Initializer = ({ id, selected, data }: any) => {
  const instance = useReactFlow();
  const t = useTranslations('node.Initializer');
  const tNodeMeta = useTranslations('meta.node');
  const NodeIcon = getNodeIcon(data.type, selected);
  return (
    <div
      className={clsx(
        'p-2 rounded-md border backdrop-blur-sm min-w-[240px]',
        selected
          ? 'shadow-box shadow-gray-700/80 border-gray-600/90 bg-gray-700/90'
          : 'border-gray-600/80 bg-gray-700/80'
      )}
    >
      <Toolbar
        nodeId={id}
        selected={selected}
        className="shadow-box shadow-gray-700/80 border-gray-600/90 bg-gray-700/90"
      />
      <div className="flex flex-col w-full gap-2 text-sm">
        <div className="flex items-center gap-2 text-primary">
          <NodeIcon className="w-5 h-5" />
          <div className="text-sm font-bold">
            {getNodeLabel(data.label, tNodeMeta)}
          </div>
        </div>
        <div className="py-1 text-sm">{t('initializer-tooltip')}</div>
        <div className="divider my-0" />
        <div className="text-base-content/80 flex items-center gap-1">
          {t('sample-messages')}
          <Tip content={t('sample-messages-tooltip')} />
        </div>
        <textarea
          rows={2}
          className="nodrag nowheel textarea textarea-xs textarea-bordered w-full bg-transparent rounded"
          value={
            data.sample_messages
              ? isArray(data.sample_messages)
                ? data.sample_messages.join('\n')
                : data.sample_messages
              : ''
          }
          onChange={e =>
            setNodeData(instance, id, {
              sample_messages: e.target.value.split('\n'),
            })
          }
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-16 !bg-primary"
      />
    </div>
  );
};

export default Initializer;
