'use client';

import { useChats, useMediaQuery } from '@/hooks';
import Chat from '../../../components/Chat';
import { useEffect } from 'react';

const Page = ({ params: { id } }: any) => {
  const { setActiveChat } = useChats();
  useEffect(() => {
    setActiveChat(id);
  }, [id]);

  return <Chat chatId={id} standalone />;
};

export default Page;
