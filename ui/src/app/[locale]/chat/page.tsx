'use client';

import { useTranslations } from 'next-intl';
import FlowList from '../components/FlowList';
import { RiRobot2Fill } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { useChats } from '@/hooks';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import ChatList from '../components/ChatList';

const ChatAction = ({ flow }: any) => {
  const t = useTranslations('page.Chat');
  const { createChat, isCreating } = useChats();
  const router = useRouter();
  const onChat = async (e: any) => {
    await createChat(flow.id, 'flow')
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
        <RiRobot2Fill
          className={clsx('w-4 h-4', { 'animate-spin': isCreating })}
        />
      )}
      {t('start-chat')}
    </div>
  );
};

const ChatPage = () => {
  const t = useTranslations('page.Chat');

  return (
    <div className="flex flex-col items-center w-full h-full p-2">
      <title>Chat | FlowGen</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm p-2">
        <span className="text-5xl font-bold p-4">{t('chat-tagline')}</span>
        <span className="text-lg p-4">{t('select-chat')}</span>
      </div>
      <div className="divider">{t('chat-sessions')}</div>
      <div className="flex flex-wrap justify-center gap-4 p-2">
        <ChatList maxCount={10} disableSelection horitontal />
      </div>
      <div className="divider">{t('your-flows')}</div>
      <FlowList action={ChatAction} suppressLink />
    </div>
  );
};
export default ChatPage;
