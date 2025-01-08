'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useChat, useChats } from '@/hooks';
import { ChatPane } from '@/components/chat/chat-pane';
import { useEffect } from 'react';
import { ChatList } from '@/components/chat/chat-list';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { ChatListButton } from '@/components/chat/chat-list-button';

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const chatId = parseInt(id, 10);

  const { setActiveChatId } = useChats();
  const { chat } = useChat(chatId);

  useEffect(() => {
    if (chatId !== -1) {
      setActiveChatId(chatId);
    }
    if (chat?.name && typeof window !== 'undefined') {
      document.title = `${chat?.name || 'Chat'} | Agentok Studio`;
    }
  }, [chatId, chat?.name]);

  console.log('chat page:', chatId, chat);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20} minSize={20} maxSize={40}>
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center justify-between w-full border-b p-2">
            <span className="font-bold">Chats</span>
            <ChatListButton />
          </div>
          <ChatList />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        <ChatPane projectId={-1} chatId={chatId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
