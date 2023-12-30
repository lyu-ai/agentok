'use client';

import { useChat, useChats } from '@/hooks';
import Chat from '../../../components/Chat';
import { useEffect } from 'react';

const Page = ({ params: { id } }: any) => {
  const { setActiveChat } = useChats();
  const { chat } = useChat(id);
  useEffect(() => {
    setActiveChat(id);
    if (chat?.name && typeof window !== 'undefined') {
      document.title = `${chat.name} | FlowGen`;
    }
  }, [id, chat?.name, setActiveChat]);

  return <Chat chatId={id} standalone />;
};

export default Page;
