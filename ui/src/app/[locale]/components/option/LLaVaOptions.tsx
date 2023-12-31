import { setNodeData } from '../../utils/flow';
import { useReactFlow } from 'reactflow';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const LLavaOptions = ({ id, data, selected }: any) => {
  const instance = useReactFlow();
  const t = useTranslations('node.Assistant');
  useEffect(() => {
    if (data?.llava_config?.base_url === undefined) {
      setNodeData(instance, id, {
        llava_config: {
          mode: 'remote',
          base_url:
            'yorickvp/llava-13b:e272157381e2a3bf12df3a8edd1f38d1dbd736bbb7437277c8b34175f8fce358',
        },
      });
    }
  });
  return (
    <div className="flex flex-col gap-2">
      <div className="form-control">
        <label className="flex flex-col gap-2">
          <span className="label-text">{t('llava-url')}</span>
          <input
            id="enable_llava"
            type="text"
            className="input input-sm input-bordered bg-transparent rounded"
            value={data.llava_config?.base_url ?? ''}
            onChange={e => {
              setNodeData(instance, id, {
                llava_config: {
                  mode: 'remote',
                  base_url: e.target.value,
                },
              });
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default LLavaOptions;
