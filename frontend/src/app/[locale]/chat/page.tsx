'use client';

import { useTranslations } from 'next-intl';
import FlowList from '../components/FlowList';

const ChatAction = ({ flow }: any) => {
  return (
    <a
      href={`/chat/flow-${flow.id}`}
      className="btn group-hover:btn-primary rounded btn-sm"
    >
      Chat
    </a>
  );
};

const ChatPage = () => {
  const t = useTranslations('page.Chat');

  return (
    <div className="flex flex-col items-center w-full h-full p-2">
      <title>Chat | FlowGen</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm font-bold p-2">
        <span className="text-5xl font-bold p-4">{t('chat-tagline')}</span>
        <span className="text-lg p-4">{t('select-flow')}</span>
      </div>
      <div className="divider" />
      <FlowList action={ChatAction} />
    </div>
  );
};
export default ChatPage;
