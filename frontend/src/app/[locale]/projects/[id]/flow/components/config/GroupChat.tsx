import PopupDialog from '@/components/PopupDialog';
import clsx from 'clsx';
import { useReactFlow } from 'reactflow';
import { setNodeData } from '../../utils/flow';
import { useTranslations } from 'next-intl';
import { RiGroup3Fill } from 'react-icons/ri';

const GroupChatConfig = ({ nodeId, data, className, ...props }: any) => {
  const instance = useReactFlow();
  const t = useTranslations('option.GroupChatConfig');
  return (
    <PopupDialog
      title={
        <div className="flex items-center gap-2">
          <RiGroup3Fill className="w-5 h-5" />
          <span className="text-md font-bold">{t('title')}</span>
        </div>
      }
      className={clsx(
        'flex flex-col  bg-gray-800/80 backgrop-blur-md border border-gray-700 shadow-box-lg shadow-gray-700',
        className
      )}
      classNameTitle="border-b border-base-content/10"
      classNameBody="flex flex-grow flex-col w-full h-full p-2 gap-2 text-sm overflow-y-auto"
      {...props}
    >
      <div className="flex flex-col w-full gap-2">
        <div className="flex items-center gap-2">
          <span>{t('speaker-selection-method')}</span>
          <div className="flex items-center gap-2">
            <select
              className="select select-bordered select-sm bg-transparent rounded"
              value={data.speaker_selection_method ?? 'auto'}
              onChange={(e) => {
                setNodeData(instance, nodeId, {
                  speaker_selection_method: e.target.value,
                });
              }}
            >
              <option value={'auto'}>Auto</option>
              <option value={'manual'}>Manual</option>
              <option value={'random'}>Random</option>
              <option value={'round_robin'}>Round Robin</option>
            </select>
          </div>
        </div>
        <div className="flex items-center text-sm gap-2 w-full">
          <div className="whitespace-nowrap text-base-content/80 w-48">
            {`${t('max-round')} - [${data?.max_round ?? 'None'}]`}
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={data?.max_round ?? 0}
            onChange={(e) => {
              setNodeData(instance, nodeId, {
                max_round:
                  e.target.valueAsNumber === 0 ? null : e.target.valueAsNumber,
              });
            }}
            className="range range-xs w-full nodrag"
          />
        </div>
        <label className="label flex items-center justify-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data?.send_introductions}
            onChange={(e) =>
              setNodeData(instance, nodeId, {
                send_introductions: e.target.checked,
              })
            }
            className="checkbox checkbox-xs rounded"
          />
          <div className="whitespace-nowrap text-base-content/80">
            {`${t('send-introductions')}`}
          </div>
        </label>
      </div>
    </PopupDialog>
  );
};

export default GroupChatConfig;
