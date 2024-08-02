import clsx from 'clsx';
import { useReactFlow } from 'reactflow';
import { setNodeData } from '../../utils/flow';
import { useTranslations } from 'next-intl';
import Tip from '@/components/Tip';
import { isArray } from 'lodash-es';
import GenericNode from './GenericNode';

const Initializer = ({ id, data, ...props }: any) => {
  const instance = useReactFlow();
  const t = useTranslations('node.Initializer');
  return (
    <GenericNode
      id={id}
      data={data}
      nodeClass="general"
      ports={[{ type: 'output', name: '' }]}
      {...props}
    >
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
    </GenericNode>
  );
};

export default Initializer;
