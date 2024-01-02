import EditButton from '@/components/EditButton';
import EditableText from '@/components/EditableText';
import clsx from 'clsx';
import { IoExtensionPuzzleSharp } from 'react-icons/io5';
import { Handle, useReactFlow } from 'reactflow';
import { setNodeData } from '../../utils/flow';
import Toolbar from './Toolbar';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const CustomConversable = ({ id, data, selected }: any) => {
  const [editingName, setEditingName] = useState(false);
  const instance = useReactFlow();
  const NodeIcon = IoExtensionPuzzleSharp;
  const t = useTranslations('node.CustomConversable');

  return (
    <div
      className={clsx(
        'p-2 rounded-md border min-w-[240px] backdrop-blur-sm',
        selected
          ? 'shadow-box shadow-orange-700 bg-orange-700 border-orange-600'
          : 'border-orange-600 bg-orange-700/80'
      )}
    >
      <Toolbar
        nodeId={id}
        selected={selected}
        className="bg-orange-700 border-orange-600"
      >
        <EditButton
          editing={editingName}
          setEditing={setEditingName}
          defaultLabel={t('name-edit-tooltip')}
          editingLabel={t('name-edit-done-tooltip')}
        />
      </Toolbar>
      <div className="flex flex-col w-full gap-2 text-sm">
        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <NodeIcon className="w-5 h-5" />
            <div className="text-sm font-bold">{data.label}</div>
          </div>
          <EditableText
            text={data.name}
            onChange={(name: any) => {
              setEditingName(false);
              setNodeData(instance, id, { name: name });
            }}
            onModeChange={(editing: any) => setEditingName(editing)}
            editing={editingName}
            className="text-sm text-base-content/80 text-right"
          />
        </div>
        <div className="divider my-0" />
        <div className="flex items-center justify-between text-base-content/60 gap-2">
          <div className="font-bold text-base-content/80">
            {t('system-message')}
          </div>
        </div>
        <div
          className={clsx(
            'text-sm text-base-content/60 transition-all ease-in-out'
          )}
        >
          <textarea
            value={data.system_message ?? ''}
            onChange={e => {
              setNodeData(instance, id, { system_message: e.target.value });
            }}
            placeholder={t('system-message-placeholder')}
            className="nodrag nowheel textarea textarea-bordered w-full p-1 bg-transparent rounded"
            rows={2}
          />
        </div>
      </div>

      <Handle type="source" position={'right'} className="w-16 !bg-green-600" />
    </div>
  );
};

export default CustomConversable;
