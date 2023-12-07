import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import Chat from './Chat';
import { RiChatSmile2Fill, RiChatSmile2Line, RiAppsLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const ChatButton = ({ className, data, onLoad, onReset }: any) => {
  const [flowData, setFlowData] = useState<any>(data);
  const [activePanel, setActivePanel] = useState<'default' | 'more' | null>(
    null
  );
  const [uploading, setUploading] = useState(false);
  const t = useTranslations('component.ChatButton');

  useEffect(() => setFlowData(data), [data]);

  const onClickDefault = async () => {
    setUploading(true);
    await fetch('/api/flows', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => setActivePanel('default'))
      .finally(() => setUploading(false));
  };

  return (
    <Popover>
      <Float
        placement="bottom-end"
        offset={2}
        enter="transition ease-out duration-300"
        enterFrom="transform origin-top-right scale-0 opacity-0"
        enterTo="transform origin-top-right scale-100 opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <Popover.Button>
            <div
              className={clsx(
                className,
                'btn btn-sm bg-green-800 border-green-700 hover:bg-green-700 hover:border-green-600 rounded-md ring-none outline-none flex items-center gap-2'
              )}
              onClick={onClickDefault}
              data-tooltip-id="default-tooltip"
              data-tooltip-content={t('start-chat-tooltip')}
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <div className="relative">
                  <RiChatSmile2Line className="absolute left-0 animate-ping w-5 h-5" />
                  <RiChatSmile2Fill className="w-5 h-5" />
                </div>
              )}
              <span>{t('start-chat')}</span>
            </div>
        </Popover.Button>
        <Popover.Panel className="origin-top-right shadow-box-lg shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600 w-[480px] h-[80vh] max-h-[80vh]">
        <Chat data={flowData} />
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

export default ChatButton;
