'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useChat, useChats } from '@/hooks';
import { ChatPane } from '@/components/chat/chat-pane';
import { useEffect } from 'react';
import { ChatList } from '@/components/chat/chat-list';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ChatListButton } from '@/components/chat/chat-list-button';

export default function Page() {
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

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={200}>
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center justify-between w-full border-b  p-2">
            <span className="font-bold">Chats</span>
            <ChatListButton />
          </div>
          <ChatList />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={800}>
        <ChatPane chat={chat} standalone />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}