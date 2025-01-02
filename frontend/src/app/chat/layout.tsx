'use client';

import React from 'react';
import { useChat } from '@/hooks';
import { ChatPane } from '@/components/chat/chat-pane';
import { useParams } from 'next/navigation';
import useChatStore from '@/store/chats';
import Navbar from '@/components/navbar/navbar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const chatId = params?.id ? parseInt(params.id as string) : -1;
  const { chatSource } = useChat(chatId);
  const getChatById = useChatStore((state) => state.getChatById);
  const chat = getChatById(chatId);

  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        <div className="flex flex-col flex-grow overflow-hidden">
          {children}
        </div>
        {chatSource && chat && (
          <div className="flex flex-col w-96 border-l border-base-content/10">
            <ChatPane chat={chat} />
          </div>
        )}
      </div>
    </div>
  );
}
