'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useChat, useChats } from '@/hooks';
import ChatPane from '../components/chat/ChatPane';
import { useEffect } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') as any; // Extract id from query parameters

  const { activeChat, setActiveChat } = useChats();
  const { chat } = useChat(id);

  useEffect(() => {
    if (id && id !== activeChat) {
      setActiveChat(id);
    } else if (activeChat) {
      router.replace(`/chat?id=${activeChat}`);
    }
    if (chat?.name && typeof window !== 'undefined') {
      document.title = `${chat?.name || 'Chat'} | Agentok Studio`;
    }
  }, [id, chat?.name, setActiveChat]);

  return <ChatPane chatId={id} standalone />;
};

export default Page;
