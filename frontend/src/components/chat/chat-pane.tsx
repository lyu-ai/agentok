'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat, useChats, useUser } from '@/hooks';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ChatInput } from './chat-input';
import { MessageList } from './message-list';
import { useToast } from '@/hooks/use-toast';
import { Chat as ChatType } from '@/store/chats';
import { RealtimeChannel } from '@supabase/supabase-js';
import { genId } from '@/lib/id';
import supabase from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Loading } from '../loading';
import { isArray } from 'lodash-es';
import useProjectStore from '@/store/projects';

const SampleMessagePanel = ({ flow, className, onSelect: _onSelect }: any) => {
  const [minimized, setMinimized] = useState(false);
  const config = flow?.nodes?.find((node: any) => node.type === 'initializer');
  if (!config?.data?.sample_messages || !isArray(config.data.sample_messages)) {
    return null;
  }
  const sampleMessages = config.data.sample_messages as string[];
  const onSelect = (msg: string) => {
    setMinimized(true);
    _onSelect && _onSelect(msg);
  };
  return (
    <div className={cn(className, 'flex flex-col items-end gap-1')}>
      <button
        className="btn btn-primary btn-outline btn-xs btn-circle"
        onClick={() => setMinimized(!minimized)}
      >
        {minimized ? <Icons.chevronUp /> : <Icons.chevronDown />}
      </button>
      {!minimized &&
        sampleMessages.map((msg, i) => (
          <div
            key={i}
            onClick={() => onSelect(msg)}
            data-tooltip-id="chat-tooltip"
            data-tooltip-content="Click to send this sample message"
            data-tooltip-place="left-end"
            className="cursor-pointer btn btn-primary backdrop-blur-md text-xs max-w-xs font-normal border-opacity-80 bg-opacity-80"
          >
            <span className="line-clamp-2 text-right">{msg}</span>
          </div>
        ))}
    </div>
  );
};

interface ChatPaneProps {
  chat: ChatType;
  standalone?: boolean;
}

export const ChatPane = ({ chat, standalone }: ChatPaneProps) => {
  const { chatSource, isLoading } = useChat(chat.id);
  const { sidebarCollapsed, setSidebarCollapsed } = useChats();
  const { toast } = useToast();
  const [status, setStatus] = useState('ready');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [help, setHelp] = useState('');
  const [cleaning, setCleaning] = useState(false);
  const isFirstRender = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const chatPanePinned = useProjectStore((state) => state.chatPanePinned);
  const pinChatPane = useProjectStore((state) => state.pinChatPane);

  const fetchMessages = useCallback(async () => {
    if (chat.id === -1) return;
    setLoading(true);
    await fetch(`/api/chats/${chat.id}/messages`, {
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
      .finally(() => setLoading(false));
  }, [setMessages, chat.id]);

  // Fetch chat status
  const fetchChatStatus = useCallback(async () => {
    if (chat.id === -1) return;
    const { data, error } = await supabase
      .from('chats')
      .select('status')
      .eq('id', chat.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching chat status:', error);
    } else if (data) {
      setStatus(data.status);
    }
  }, [setStatus, chat.id]);

  const extractHelp = useCallback(() => {
    const noteNode = chatSource?.flow?.nodes?.find(
      (node: any) => node.type === 'note'
    );
    if (noteNode) {
      setHelp(noteNode.data.content);
    }
  }, [chatSource]);

  useEffect(() => {
    if (chat.id === -1) return;

    fetchMessages();
    fetchChatStatus();
    extractHelp();

    // Subscribe to chat_messages
    const messagesChannel: RealtimeChannel = supabase
      .channel(`chat_messasges_${genId()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chat.id}`,
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

    // Subscribe to chats
    const chatsChannel: RealtimeChannel = supabase
      .channel(`chats_${genId()}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chats',
          filter: `id=eq.${chat.id}`,
        },
        (payload) => {
          console.log('changes_event(chats):', payload);
          if (payload.new && 'status' in payload.new) {
            setStatus(payload.new.status);
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      if (messagesChannel) supabase.removeChannel(messagesChannel);
      if (chatsChannel) supabase.removeChannel(chatsChannel);
    };
  }, [chat.id]);

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

  const handleClean = useCallback(() => {
    setCleaning(true);
    fetch(`/api/chats/${chat.id}/messages`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(() => {
        setMessages([]);
      })
      .finally(() => setCleaning(false));
  }, [setMessages, chat.id]);

  const handleSend = useCallback(
    async (message: string) => {
      try {
        const newMessage = {
          id: genId(),
          chat_id: chat.id,
          type: 'user',
          sender: user?.email,
          content: message,
          created: new Date().toISOString(),
        };
        setMessages((msgs) => [...msgs, newMessage]);
        const resp = await fetch(`/api/chats/${chat.id}/messages`, {
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
    [chat.id, user?.email, toast]
  );

  const handleAbort = useCallback(async () => {
    try {
      const resp = await fetch(`/api/chats/${chat.id}/abort`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!resp.ok) {
        throw new Error('Failed to abort chat');
      }
    } catch (err) {
      console.error('Failed to abort chat:', err);
      toast({
        title: 'Error',
        description: 'Failed to abort chat',
        variant: 'destructive',
      });
    }
  }, [chat.id, toast]);

  if (loading || isLoading) {
    return (
      <div className="relative flex flex-col w-full h-full items-center justify-center gap-2">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="flex items-center justify-between gap-2 p-2 border-b border-base-content/10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden"
          >
            <Icons.menu className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <div className="text-sm font-bold">
              {chat.name || chatSource?.name || 'Untitled Chat'}
            </div>
            <div className="text-xs text-base-content/60">
              {chatSource?.description || 'No description'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClean}
            disabled={cleaning}
            data-tooltip-id="default-tooltip"
            data-tooltip-content="Clean chat history"
          >
            <Icons.trash className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => pinChatPane(!chatPanePinned)}
            data-tooltip-id="default-tooltip"
            data-tooltip-content={chatPanePinned ? 'Unpin' : 'Pin'}
          >
            {chatPanePinned ? (
              <Icons.pin className="w-4 h-4" />
            ) : (
              <Icons.pin className="w-4 h-4" />
            )}
          </Button>
          {standalone && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.close()}
              data-tooltip-id="default-tooltip"
              data-tooltip-content="Close"
            >
              <Icons.close className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="relative flex flex-col flex-grow w-full h-full overflow-y-auto">
        <div className="flex flex-col gap-2 p-2">
          <MessageList
            chat={chat}
            messages={messages}
            onSend={handleSend}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2 border-t border-base-content/10">
        <ChatInput
          onSubmit={handleSend}
          onAbort={handleAbort}
          loading={status === 'running'}
          disabled={status === 'failed'}
        />
        <SampleMessagePanel
          flow={chatSource?.flow}
          className="absolute bottom-20 right-2"
          onSelect={handleSend}
        />
      </div>
    </div>
  );
};
