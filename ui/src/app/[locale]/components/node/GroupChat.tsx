import clsx from 'clsx';
import { Handle, useReactFlow } from 'reactflow';
import { getNodeLabel, setNodeData } from '../../utils/flow';
import { FaUserGroup } from 'react-icons/fa6';
import Toolbar from './Toolbar';
import { useTranslations } from 'next-intl';

const GroupChatManager = ({ id, selected, data }: any) => {
  const instance = useReactFlow();
  const t = useTranslations('node.GroupChat');
  const tNodeMeta = useTranslations('meta.node');
  return (
    <div
      className={clsx(
        'p-2 rounded-md border min-w-[160px] backdrop-blur-sm',
        selected
          ? 'shadow-box shadow-gray-700/80 border-gray-600/90 bg-gray-700/90'
          : 'border-gray-600/80 bg-gray-700/80'
      )}
    >
      <Toolbar
        nodeId={id}
        selected={selected}
        className="border-gray-600/90 bg-gray-700/90"
      />
      <div className="flex flex-col w-full gap-2 text-sm">
        <div className="flex items-center gap-2 text-primary">
          <FaUserGroup className="w-5 h-5" />
          <div className="text-sm font-bold">
            {getNodeLabel(data.label, tNodeMeta)}
          </div>
        </div>
        <div className="divider my-0" />
        <div className="flex items-center justify-between text-base-content/60 gap-2">
          <div className="font-bold text-base-content/80">{t('max-round')}</div>
          <input
            type="number"
            className="input input-sm input-bordered w-20 bg-transparent rounded"
            value={data.max_round ?? 20}
            onChange={e =>
              setNodeData(instance, id, { max_round: e.target.valueAsNumber })
            }
          />
        </div>
        <div className="flex items-center justify-between cursor-pointer label gap-2 px-0">
          <span className="label-text">{t('involve-user')}</span>
          <input
            id="involve_user"
            type="checkbox"
            className="checkbox checkbox-xs bg-transparent rounded"
            checked={data.involve_user}
            onChange={e => {
              setNodeData(instance, id, { involve_user: e.target.checked });
            }}
          />
        </div>
      </div>
      <Handle type="target" position={'left'} className="w-16 !bg-primary" />
      <Handle type="source" position={'right'} className="w-16 !bg-primary" />
    </div>
  );
};

export default GroupChatManager;
