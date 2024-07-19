'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useChat, useChats } from '@/hooks';
import ChatPane from '../components/chat/ChatPane';
import { useEffect } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = parseInt(searchParams.get('id') ?? '-1'); // Extract id from query parameters

  const { activeChat, setActiveChat } = useChats();
  const { chat } = useChat(id);

  useEffect(() => {
    if (chat?.name) {
      if (id && id !== activeChat) {
        setActiveChat(id);
      } else if (activeChat !== -1) {
        router.replace(`/chat?id=${activeChat}`);
      }
      if (chat?.name && typeof window !== 'undefined') {
        document.title = `${chat?.name || 'Chat'} | Agentok Studio`;
      }
    }
  }, [id, chat?.name, setActiveChat]);

  return <ChatPane chatId={id} standalone />;
};

export default Page;
