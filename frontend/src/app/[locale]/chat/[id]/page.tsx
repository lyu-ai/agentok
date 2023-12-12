'use client';

import { useChat, useChats, useFlows, useTemplates } from '@/hooks';
import Chat from '../../components/Chat';
import clsx from 'clsx';
import Link from 'next/link';
import ChatListButton from '../../components/ChatListButton';
import { useTranslations } from 'next-intl';

const ChatList = ({ currentChatId }: { currentChatId: number }) => {
  const t = useTranslations('page.Chat');
  const { chats, isLoading: isLoadingList } = useChats();
  const { flows, isLoading: isLoadingFlows } = useFlows();
  const { templates, isLoading: isLoadingTemplates } = useTemplates();

  if (isLoadingList || isLoadingFlows || isLoadingTemplates) {
    return (
      <div className="flex w-80 items-center justify-center w-full h-full">
        <div className="loading loading-bars" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center w-full justify-between py-2">
        <span className="text-lg font-bold">{t('chat-sessions')}</span>
        <ChatListButton />
      </div>
      {chats.map(chat => {
        const chatSource =
          chat.sourceType === 'flow'
            ? flows.find((flow: any) => flow.id === Number(chat.sourceId))
            : templates.find(
                (template: any) => template.id === Number(chat.sourceId)
              );

        console.log('chatSource', chatSource, chat, chats, templates);

        return (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={clsx(
              'flex flex-col w-80 justify-center gap-2 text-sm font-bold rounded p-2 border hover:shadow-box hover:bg-base-content/40 hover:text-base-content hover:border-base-content/30',
              {
                'border-base-content/20 bg-base-content/30 shadow-box shadow-base-content/20':
                  chat.id === currentChatId,
              },
              {
                'border-base-content/5 bg-base-content/10':
                  chat.id !== currentChatId,
              }
            )}
          >
            <div className="flex w-full gap-2 justify-between items-center">
              <span className="font-bold truncate">
                {chat.name ??
                  t('default-chat-title', {
                    source_name: chatSource?.name,
                  })}
              </span>
              <span className="border border-base-content/40 text-base-content/60 rounded p-1 text-xs">
                {chat.sourceType}
              </span>
            </div>
          </Link>
        );
      })}
    </>
  );
};

const Page = ({ params: { id } }: any) => {
  const { chat, isLoading: isLoadingChat } = useChat(Number(id));
  const t = useTranslations('page.Chat');

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full w-full text-red-600">
        <span>{`Failed locating chat: ${id}`}</span>
      </div>
    );
  }

  return (
    <div
      className="flex w-full h-full items-center justify-center"
      style={{ backgroundSize: '160px' }}
    >
      <title>Chat | FlowGen</title>
      <div className="flex items-center justify-center gap-2 text-sm w-full font-bold p-2">
        <div className="z-20 flex flex-col h-[90vh] items-center gap-1 text-sm font-bold p-2 shadow-box shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/80 text-base-content border border-gray-600">
          <ChatList currentChatId={Number(id)} />
        </div>
        <div className="z-10 flex flex-1 shadow-box shadow-gray-600 rounded-xl backdrop-blur-md bg-gray-700/80 text-base-content border border-gray-600 max-w-[1200px] h-[90vh]">
          <Chat chatId={Number(id)} standalone />
        </div>
      </div>
    </div>
  );
};

export default Page;
