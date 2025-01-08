'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat, useChats, useUser } from '@/hooks';
import { Icons } from '@/components/icons';
import { ChatInput } from './chat-input';
import { MessageList } from './message-list';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';
import { genId } from '@/lib/id';
import supabase from '@/lib/supabase/client';
import { Loading } from '@/components/loader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ChatPaneProps {
  projectId: number;
  chatId: number;
}

export const ChatPane = ({ projectId, chatId }: ChatPaneProps) => {
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const { chat, chatSource, isLoading: isLoadingChat } = useChat(currentChatId);
  const { createChat, isCreating } = useChats();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const isFirstRender = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const fetchMessages = useCallback(async () => {
    if (chatId === -1) return;
    setIsLoadingMessages(true);
    await fetch(`/api/chats/${chatId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to fetch messages');
        }
        return resp.json();
      })
      .then((json) => {
        setMessages(json ? json : []);
      })
      .catch((err) => {
        console.error('Failed to fetch messages:', err);
      })
      .finally(() => setIsLoadingMessages(false));
  }, [setMessages, chatId]);

  // Fetch chat status
  useEffect(() => {
    setCurrentChatId(chatId);
    if (chatId === -1) return;

    fetchMessages();

    // Subscribe to chat_messages
    const messagesChannel: RealtimeChannel = supabase
      .channel(`chat_messasges_${genId()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log('changes_event(chat_messages):', payload);
          if (payload.new && payload.new.type !== 'user') {
            setMessages((msgs) =>
              msgs.some((m) => m.id === payload.new.id)
                ? msgs
                : [...msgs, payload.new]
            );
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      if (messagesChannel) supabase.removeChannel(messagesChannel);
    };
  }, [chatId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Disable the scroll animation for the first render.
    if (isFirstRender.current) {
      messagesEndRef.current?.scrollIntoView();
      isFirstRender.current = false;
    } else {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(
    async (message: string) => {
      try {
        const newMessage = {
          id: genId(),
          chat_id: chatId,
          type: 'user',
          sender: user?.email,
          content: message,
          created: new Date().toISOString(),
        };
        setMessages((msgs) => [...msgs, newMessage]);
        const resp = await fetch(`/api/chats/${chatId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        });
        if (!resp.ok) {
          throw new Error('Failed to send message');
        }
      } catch (err) {
        console.error('Failed to send message:', err);
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive',
        });
      }
    },
    [chatId, user?.email, toast]
  );

  const handleStartChat = useCallback(async () => {
    try {
      const chat = await createChat(projectId, 'project');
      setCurrentChatId(chat.id);
    } catch (err) {
      console.warn('Failed to add chat:', err);
      toast({
        title: 'Error',
        description: 'Failed to add chat',
        variant: 'destructive',
      });
    }
  }, [projectId, createChat]);

  const handleReset = useCallback(async () => {
    setMessages([]);
  }, [setMessages]);

  if (isLoadingMessages || isLoadingChat) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center bg-muted gap-2">
        <Loading />
        <div className="relative flex flex-col gap-1 w-full max-w-4xl mx-auto p-2 pt-0">
          <ChatInput
            chatId={chatId}
            onSend={handleSend}
            onReset={handleReset}
            disabled={true}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  if (!chat && !isLoadingChat) {
    return (
      <div className="flex flex-col w-full h-full bg-muted items-center justify-center gap-2 text-muted-foreground/50">
        <Icons.agent className="w-8 h-8" />
        <p>Let&apos;s start chatting!</p>
        <Button onClick={handleStartChat}>
          {isCreating && <Icons.spinner className="w-4 h-4 animate-spin" />}
          Start Chat
        </Button>
      </div>
    );
  }

  const config = chatSource?.flow?.nodes?.find(
    (node: any) => node.type === 'initializer'
  );
  let sampleMessages = config?.data?.sample_messages; // string or array
  if (sampleMessages && typeof sampleMessages === 'string') {
    sampleMessages = sampleMessages.split('\n');
  }

  return (
    <div className="flex flex-col w-full h-full bg-muted">
      {messages.length > 0 ? (
        <ScrollArea className="flex flex-col w-full flex-1 p-2 pb-0">
          <MessageList
            chat={chat}
            messages={messages}
            onSend={handleSend}
            className="max-w-4xl mx-auto mb-1"
          />
          <div className="flex justify-center p-1">
            <Badge variant="outline" className="text-xs">
              {chat?.status}
            </Badge>
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/50">
          <Icons.agent className="w-8 h-8" />
          <p>Let&apos;s start chatting!</p>
        </div>
      )}
      <div className="relative flex flex-col gap-1 w-full max-w-4xl mx-auto p-2 pt-0">
        <ChatInput
          chatId={chatId}
          onSend={handleSend}
          onReset={handleReset}
          disabled={currentChatId === -1}
          className="w-full"
          sampleMessages={sampleMessages}
        />
      </div>
    </div>
  );
};
