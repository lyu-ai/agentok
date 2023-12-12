import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import { IoAddCircle, IoApps } from 'react-icons/io5';
import { useTranslations } from 'next-intl';
import FlowList from './FlowList';

const ChatListButton = ({ className, onSelect }: any) => {
  const t = useTranslations('component.ChatListButton');

  return (
    <Popover>
      <Float
        placement="bottom"
        offset={5}
        enter="transition ease-out duration-300"
        enterFrom="transform scale-0 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <div className="flex items-center gap-1">
          <div
            className={clsx(
              className,
              'join-item btn btn-sm btn-primary flex items-center gap-2'
            )}
            data-tooltip-id="default-tooltip"
            data-tooltip-content={t('new-chat-tooltip')}
          >
            <div className="relative">
              <IoAddCircle className="w-4 h-4" />
            </div>
            <span>{t('new-chat')}</span>
          </div>
          <Popover.Button>
            <div
              className={clsx(
                className,
                'join-item btn btn-sm btn-primary flex items-center gap-2'
              )}
              data-tooltip-id="default-tooltip"
              data-tooltip-content={t('from-template-tooltip')}
            >
              <div className="relative">
                <IoApps className="w-4 h-4" />
              </div>
            </div>
          </Popover.Button>
        </div>
        <Popover.Panel className="origin-top-left absolute shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600 overflow-auto max-h-[80vh]">
          <FlowList />
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

export default ChatListButton;
