'use client';

import { ChatPane } from '@/components/chat/chat-pane';
import { useChats } from '@/hooks';
import { use, useEffect } from 'react';

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const chatId = parseInt(id);
  const { activeChatId, setActiveChatId } = useChats();
  useEffect(() => {
    if (chatId && chatId !== activeChatId) {
      setActiveChatId(chatId);
    }
  }, [chatId, activeChatId, setActiveChatId]);
  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height))]">
      <ChatPane projectId={-1} chatId={chatId} />
    </div>
  );
}
