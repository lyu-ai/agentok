'use client';

import { useTranslations } from 'next-intl';
import FlowList from '../components/FlowList';

const ChatPage = () => {
  const t = useTranslations('page.Chat');

  return (
    <div className="flex flex-col w-full h-full p-2">
      <title>Chat | FlowGen</title>
      <div className="flex items-center justify-start w-full gap-2 text-sm font-bold">
        <span>{t('select-flow')}</span>
      </div>
      <div className="divider" />
      <FlowList action="chat" />
    </div>
  );
};
export default ChatPage;
