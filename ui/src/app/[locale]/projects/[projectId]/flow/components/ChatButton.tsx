import { Float } from '@headlessui-float/react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import clsx from 'clsx';
import ChatPane from './ChatPane';
import { RiRobot2Fill, RiRobot2Line } from 'react-icons/ri';
import { useTranslations } from 'next-intl';

const ChatButton = ({ className, onStartChat, chatId }: any) => {
  const t = useTranslations('component.ChatButton');

  return (
    <Popover>
      <Float
        placement="top-end"
        offset={5}
        enter="transition ease-out duration-300"
        enterFrom="transform origin-bottom-right scale-0 opacity-0"
        enterTo="transform origin-bottom-right scale-100 opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <PopoverButton
          className={clsx(
            className,
            'btn btn-lg btn-circle btn-outline btn-primary flex items-center gap-2'
          )}
          onClick={onStartChat}
          data-tooltip-id="default-tooltip"
          data-tooltip-content={t('start-chat-tooltip')}
        >
          <div className="relative">
            <RiRobot2Line className="absolute left-0 animate-ping w-7 h-7" />
            <RiRobot2Fill className="w-7 h-7" />
          </div>
        </PopoverButton>
        <PopoverPanel className="origin-bottom-right shadow-box-lg shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600 w-[400px] md:w-96 h-[80vh] max-h-[75vh]">
          <ChatPane chatId={chatId} onStartChat={onStartChat} />
        </PopoverPanel>
      </Float>
    </Popover>
  );
};

export default ChatButton;
