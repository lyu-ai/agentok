'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useChat, useChats } from '@/hooks';
import ChatPane from '../components/chat/ChatPane';
import { useEffect } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = parseInt(searchParams.get('id') ?? '-1'); // Extract chatId from query parameters

  const { activeChatId, setActiveChatId } = useChats();
  const { chat } = useChat(chatId);

  useEffect(() => {
    if (chatId !== -1) {
      setActiveChatId(chatId);
    } else if (activeChatId !== -1) {
      router.replace(`/chat?id=${activeChatId}`);
    }
    if (chat?.name && typeof window !== 'undefined') {
      document.title = `${chat?.name || 'Chat'} | Agentok Studio`;
    }
  }, [chatId, activeChatId]);

  if (!chat) {
    return null;
  }

  return <ChatPane chat={chat} standalone />;
};

export default Page;
