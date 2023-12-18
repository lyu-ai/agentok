'use client';

import { useChats, useMediaQuery } from '@/hooks';
import Chat from '../../../components/Chat';
import { useEffect } from 'react';

const Page = ({ params: { id } }: any) => {
  const { setActiveChat } = useChats();
  const { setSidebarCollapsed } = useChats();
  const isMediumScreen = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    setActiveChat(id);
  }, [id]);
  useEffect(() => {
    if (isMediumScreen) {
      setSidebarCollapsed(true); // When screen is medium, collapse the sidebar
    }
  }, [isMediumScreen]);

  return <Chat chatId={id} standalone />;
};

export default Page;
