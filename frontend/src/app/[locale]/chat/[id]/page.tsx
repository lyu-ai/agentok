'use client';

import { useChat } from '@/hooks';
import Chat from '../../components/Chat';
import ChatListButton from '../../components/ChatListButton';
import { useTranslations } from 'next-intl';
import ChatList from '../../components/ChatList';
import clsx from 'clsx';

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
  const { chat, isLoading: isLoadingChat } = useChat(Number(id));
  const t = useTranslations('page.Chat');

  console.log('chat', chat, isLoadingChat);

  if (!chat && !isLoadingChat) {
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
            'transition-all ease-in-out',
            {
              hidden:
                !chat?.sidebarExpanded &&
                !window.matchMedia('(min-width: 768px)').matches,
              'md:flex': window.matchMedia('(min-width: 768px)').matches, // flex on medium screens
              'collapsed-width': !chat?.sidebarExpanded, // Apply collapsing when sidebar is not expanded
              'expanded-width': chat?.sidebarExpanded, // Apply expanding when sidebar is expanded
            }
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
