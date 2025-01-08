'use client';

import React from 'react';
import { useChat } from '@/hooks';
import { useParams } from 'next/navigation';
import useChatStore from '@/store/chats';
import Navbar from '@/components/navbar/navbar';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const chatId = params?.id ? parseInt(params.id as string) : -1;
  const { chatSource } = useChat(chatId);
  const getChatById = useChatStore((state) => state.getChatById);
  const chat = getChatById(chatId);

  return (
    <div className="flex flex-col w-screen h-screen bg-muted">
      <Navbar />
      <div className="h-[calc(100vh-var(--header-height))] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
