'use client';

import { useTranslations } from 'next-intl';
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
  const t = useTranslations('component.ChatPane');
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
            data-tooltip-content={t('click-to-send')}
            data-tooltip-place="left-end"
            className="cursor-pointer btn btn-primary backdrop-blur-md text-xs max-w-xs font-normal border-opacity-80 bg-opacity-80"
          >
            <span className="line-clamp-2 text-right">{msg}</span>
          </div>
        ))}
    </div>
  );
};

// const StatusTag = ({ status }: { status: string }) => {
//   const t = useTranslations('component.ChatPane');
//   const statusMap: { [key: string]: { label: string; icon: any } } = {
//     ready: { label: t('ready'), icon: Icons.ready },
//     running: { label: t('running'), icon: Icons.running },
//     wait_for_human_input: {
//       label: t('wait-for-human-input'),
//       icon: Icons.wait,
//     },
//     completed: { label: t('completed'), icon: Icons.completed },
//     aborted: { label: t('aborted'), icon: Icons.aborted },
//     failed: { label: t('failed'), icon: Icons.failed },
//   };
//   const StatusIcon = statusMap[status].icon;
//   const label = statusMap[status].label || status;
//   return (
//     <span
//       className={cn(
//         'flex items-center justify-center text-xs rounded-lg h-6 w-6',
//         {
//           'border-primary text-primary bg-blue-600 animate-pulse':
//             status === 'running',
//           'border-success text-success': status === 'completed',
//           'border-error text-error': status === 'failed',
//           'border-warning text-warning': status === 'wait_for_human_input',
//           'border-base-content text-base-content': status === 'ready',
//         }
//       )}
//     >
//       <StatusIcon className="w-4 h-4" />
//     </span>
//   );
// };

interface ChatPaneProps {
  chat: ChatType;
  standalone?: boolean;
}

export const ChatPane = ({ chat, standalone }: ChatPaneProps) => {
  const t = useTranslations('component.ChatPane');
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
          type: 'user',
          sender: user?.user_metadata.full_name ?? 'User',
          content: message ?? '\n', // If it's empty message, let's simulate a Enter key-press
          created_at: new Date().toISOString(),
        };
        setMessages((msgs) => [...msgs, newMessage]);
        const res = await fetch(
          `/api/chats/${chat.id}/${
            status === 'wait_for_human_input' ? 'input' : 'messages'
          }`,
          {
            method: 'POST',
            body: JSON.stringify(newMessage),
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        if (!res.ok) {
          console.warn('Failed sending message:', res.statusText);
          toast({
            title: t('error'),
            description: t('error-sending-message'),
            variant: 'destructive',
          });
          return false;
        }
        const json = await res.json();
        console.log('message sent:', json);
        return true;
      } catch (error) {
        toast({
          title: t('error'),
          description: t('error-sending-message'),
          variant: 'destructive',
        });
      }
    },
    [t, toast]
  );

  // const handleAbort = useCallback(() => {
  //   abortMessage();
  // }, [abortMessage]);

  // If the chat is not loaded yet, show a button to start the chat.
  if (!chat || chat.id === -1) {
    return (
      <div className="flex flex-col w-full h-full shadow-box rounded-xl bg-gray-700/80 text-base-content border border-gray-600">
        <div className="p-2 flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => pinChatPane(!chatPanePinned)}
            data-tooltip-content={chatPanePinned ? t('unpin') : t('pin')}
            data-tooltip-id="chat-tooltip"
          >
            {chatPanePinned ? (
              <Icons.unpin className="w-4 h-4" />
            ) : (
              <Icons.pin className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="flex flex-grow w-full gap-2 items-center justify-center">
          <Icons.chat className="w-5 h-5" />
          {t('start-chat')}
        </div>
      </div>
    );
  }

  let messagesToDisplay = [...messages];
  if (status === 'running') {
    messagesToDisplay.push({
      id: genId(),
      type: 'assistant',
      chat_id: chat.id,
      content: t('thinking'),
      created_at: new Date().toISOString(),
    });
  }

  function handleAbort(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="flex flex-col w-full h-full shadow-box shadow-gray-700 rounded-xl bg-gray-700/80 text-base-content border border-gray-600">
      <div className="flex items-center justify-between w-full p-2">
        <div className="flex items-center gap-2 text-sm">
          {standalone && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <Icons.chevronRight className="w-4 h-4" />
              ) : (
                <Icons.chevronLeft className="w-4 h-4" />
              )}
            </Button>
          )}
          <span className="line-clamp-1 font-bold">{`${
            chat?.name ?? 'Untitled ' + chat.id
          } ${chatSource?.name ? ' | ' + chatSource?.name : ''}`}</span>
          {status && (
            <span
              className={cn(
                'flex items-center justify-center text-xs rounded-lg h-6 w-6',
                {
                  'border-primary text-primary bg-blue-600 animate-pulse':
                    status === 'running',
                  'border-success text-success': status === 'completed',
                  'border-error text-error': status === 'failed',
                  'border-warning text-warning':
                    status === 'wait_for_human_input',
                  'border-base-content text-base-content': status === 'ready',
                }
              )}
            >
              <Icons.chat className="w-4 h-4" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            data-tooltip-id="chat-tooltip"
            data-tooltip-content={t('clean-history')}
            onClick={handleClean}
          >
            {cleaning ? (
              <div className="animate-spin h-4 w-4 border-b-2 border-white" />
            ) : (
              <Icons.brush className="w-4 h-4" />
            )}
          </Button>
          {!standalone && (
            <a
              className="btn btn-xs btn-ghost btn-square"
              data-tooltip-id="chat-tooltip"
              data-tooltip-content={t('open-in-new-window')}
              href={`/chat?id=${chat?.id}`}
              target="_blank"
            >
              <Icons.externalLink className="w-4 h-4" />
            </a>
          )}
          {!standalone && chat?.from_type === 'project' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => pinChatPane(!chatPanePinned)}
              data-tooltip-content={chatPanePinned ? t('unpin') : t('pin')}
              data-tooltip-id="chat-tooltip"
            >
              {chatPanePinned ? (
                <Icons.unpin className="w-4 h-4" />
              ) : (
                <Icons.pin className="w-4 h-4" />
              )}
            </Button>
          )}
          {standalone && chat?.from_type === 'project' && (
            <a
              className="btn btn-xs btn-ghost btn-square"
              data-tooltip-id="chat-tooltip"
              data-tooltip-content={t('go-to-editor')}
              data-tooltip-place="bottom"
              href={`/projects/${chat.from_project}/flow`}
              target="_blank"
            >
              <Icons.shuffle className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
      <div className="relative flex mx-auto w-full flex-grow flex-col overflow-y-auto p-1 font-normal">
        {loading ? (
          <Loading />
        ) : (
          <MessageList
            chat={chat}
            messages={messagesToDisplay}
            onSend={handleSend}
          />
        )}
        <div ref={messagesEndRef} id="chat-messages-bottom"></div>
      </div>
      <div className="relative justify-center w-full p-1 font-normal">
        <ChatInput
          className={cn(
            'flex items-center p-1 w-full bg-base-100/70 border rounded-lg shadow-lg',
            {
              'border-secondary bg-secondary/40':
                status === 'wait_for_human_input',
              'border-primary ': status !== 'wait_for_human_input',
            }
          )}
          onSubmit={handleSend}
          onStop={handleAbort}
          disabled={false}
          loading={isLoading}
        />
        <SampleMessagePanel
          flow={chatSource?.flow}
          className="absolute bottom-full mb-2 right-2 z-20"
          onSelect={handleSend}
        />
      </div>
    </div>
  );
};
