'use client';

import { useChat, useChats } from '@/hooks';
import Chat from '../../components/Chat';
import ChatListButton from '../../components/ChatListButton';
import { useTranslations } from 'next-intl';
import ChatList from '../../components/ChatList';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useMediaQuery } from '@/hooks';

const ChatListPane = () => {
  const t = useTranslations('page.Chat');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center w-80 justify-between p-2 gap-2">
        <span className="font-bold">{t('chat-sessions')}</span>
        <ChatListButton />
      </div>
      <div className="flex flex-col w-full h-full p-1 gap-1 overflow-y-auto overflow-x-hidden">
        <ChatList />
      </div>
    </div>
  );
};

const Page = ({ params: { id } }: any) => {
  const { chat, isError } = useChat(Number(id));
  const { setActiveChat } = useChats();
  const t = useTranslations('page.Chat');
  const isMediumScreen = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    setActiveChat(Number(id));
  }, [id]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full w-full text-red-600">
        <span>{`Failed locating chat: ${id}`}</span>
      </div>
    );
  }

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
          <ChatListPane />
        </div>
        <div className="z-10 flex flex-1 shadow-box shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/80 text-base-content border border-gray-600">
          <Chat chatId={Number(id)} standalone />
        </div>
      </div>
    </div>
  );
};

export default Page;
