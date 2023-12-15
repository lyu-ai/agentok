'use client';

import { useTranslations } from 'next-intl';
import FlowList from '../components/FlowList';
import { RiRobot2Fill } from 'react-icons/ri';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChats } from '@/hooks';
import { toast } from 'react-toastify';
import ChatList from '../components/ChatList';

const ChatAction = ({ flow }: any) => {
  const t = useTranslations('page.Chat');
  const { createChat, isCreating } = useChats();
  const router = useRouter();
  const onChat = (e: any) => {
    createChat(flow.id, 'flow')
      .then(chat => {
        if (chat) {
          router.push(`/chat/${chat.id}`);
        }
      })
      .catch(e => {
        console.log(e);
        toast.error(`Failed to create chat: ${e}`);
      });
  };
  return (
    <div
      onClick={onChat}
      className="btn group-hover:btn-primary btn-sm group-hover:animate-pulse"
    >
      {isCreating ? (
        <div className="loading loading-sm" />
      ) : (
        <RiRobot2Fill className="w-4 h-4" />
      )}
      {t('start-chat')}
    </div>
  );
};

const ChatPage = ({ searchParams: { source_id, source_type } }: any) => {
  const t = useTranslations('page.Chat');
  const router = useRouter();
  const { createChat, isCreating } = useChats();
  const hasCreatedChat = useRef(false);

  useEffect(() => {
    if (hasCreatedChat.current) {
      // Prevent the side-effect if it has already run once
      return;
    }
    if (source_type === 'flow' || source_type === 'template') {
      createChat(source_id, source_type).then(chat => {
        if (chat) {
          hasCreatedChat.current = true;
          router.replace(`/chat/${chat.id}`);
        }
      });
    }
  }, []);

  if (source_type || isCreating) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="loading loading-bars" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full p-2">
      <title>Chat | FlowGen</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm font-bold p-2">
        <span className="text-5xl font-bold p-4">{t('chat-tagline')}</span>
        <span className="text-lg p-4">{t('select-chat')}</span>
      </div>
      <div className="divider">{t('chat-sessions')}</div>
      <div className="flex flex-wrap justify-center gap-4 p-2">
        <ChatList maxCount={10} disableSelection />
      </div>
      <div className="divider">{t('your-flows')}</div>
      <FlowList action={ChatAction} />
    </div>
  );
};
export default ChatPage;
