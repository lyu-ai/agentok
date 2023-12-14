'use client';

import { useChat } from '@/hooks';
import Chat from '../../components/Chat';
import ChatListButton from '../../components/ChatListButton';
import { useTranslations } from 'next-intl';
import ChatList from '../../components/ChatList';
import clsx from 'clsx';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ChatListPane = ({ currentChatId }: { currentChatId: number }) => {
  const t = useTranslations('page.Chat');

  return (
    <div className="flex flex-col">
      <div className="flex items-center w-full justify-between p-2">
        <span className="text-lg font-bold">{t('chat-sessions')}</span>
        <ChatListButton />
      </div>
      <div className="flex flex-col w-full h-full gap-1 overflow-y-auto overflow-x-hidden p-1">
        <ChatList currentChatId={currentChatId} />
      </div>
    </div>
  );
};

const Page = ({ params: { id } }: any) => {
  const { chat, isLoading: isLoadingChat, isError, collapseSidebar } = useChat(
    Number(id)
  );
  const t = useTranslations('page.Chat');
  const isMediumScreen = useMediaQuery('(max-width: 768px)');

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full w-full text-red-600">
        <span>{`Failed locating chat: ${id}`}</span>
      </div>
    );
  }

  if (isLoadingChat) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="loading loading-bars loading-sm" />
      </div>
    );
  }

  console.log('chat?.sidebarCollapsed', chat?.sidebarCollapsed);

  return (
    <div className="flex w-full h-full">
      <title>Chat | FlowGen</title>
      <div className="flex gap-2 text-sm w-full h-full font-bold p-2">
        <div
          className={clsx(
            'z-20 gap-1 text-sm font-bold shadow-box shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/80 text-base-content border border-gray-600',
            (isMediumScreen && chat?.sidebarCollapsed === undefined) ||
              chat?.sidebarCollapsed
              ? 'hidden'
              : 'md:flex'
          )}
        >
          <ChatListPane currentChatId={Number(id)} />
        </div>
        <div className="z-10 flex flex-1 shadow-box shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/80 text-base-content border border-gray-600">
          <Chat chatId={Number(id)} standalone />
        </div>
      </div>
    </div>
  );
};

export default Page;
