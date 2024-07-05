'use client';

import { useChat, useChats } from '@/hooks';
import ChatPane from '../../../components/ChatPane';
import { useEffect } from 'react';

const Page = ({ params: { id } }: any) => {
  const { setActiveChat } = useChats();
  const { chat } = useChat(id);
  useEffect(() => {
    setActiveChat(id);
    if (chat?.name && typeof window !== 'undefined') {
      document.title = `${chat.name} | Agentok Studio`;
    }
  }, [id, chat?.name, setActiveChat]);

  return <ChatPane chatId={id} standalone />;
};

export default Page;
