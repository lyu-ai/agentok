import { useCallback, useEffect, useRef, useState } from 'react';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiBrush3Line,
  RiCheckboxCircleLine,
  RiContractLeftLine,
  RiContractRightLine,
  RiExternalLinkLine,
  RiPictureInPictureExitLine,
  RiShuffleLine,
} from 'react-icons/ri';
import ChatInput from './ChatInput';
import { genId } from '@/utils/id';
import supabase from '@/utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { StatusMessage } from '@/utils/chat';
import { useTranslations } from 'next-intl';
import { useChat, useChats } from '@/hooks';
import { Tooltip } from 'react-tooltip';
import MessageList from './MessageList';
import clsx from 'clsx';
import { isArray } from 'lodash-es';
import useProjectStore from '@/store/projects';
import {
  RiAlertLine,
  RiChatSmile2Line,
  RiPushpinLine,
  RiRidingLine,
  RiSendPlaneLine,
  RiStopLine,
  RiUnpinLine,
} from 'react-icons/ri';
import Loading from '@/components/Loading';
import { useUser } from '@/hooks/useUser';
import { Chat as ChatType } from '@/store/chats';

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
    <div className={clsx(className, 'flex flex-col items-end gap-1')}>
      <button
        className="btn btn-primary btn-outline btn-xs btn-circle"
        onClick={() => setMinimized(!minimized)}
      >
        {minimized ? <RiArrowUpLine /> : <RiArrowDownLine />}
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

const StatusTag = ({ status }: { status: string }) => {
  const t = useTranslations('component.ChatPane');
  const statusMap: { [key: string]: { label: string; icon: any } } = {
    ready: { label: t('ready'), icon: RiSendPlaneLine },
    running: { label: t('running'), icon: RiRidingLine },
    wait_for_human_input: {
      label: t('wait-for-human-input'),
      icon: RiChatSmile2Line,
    },
    completed: { label: t('completed'), icon: RiCheckboxCircleLine },
    aborted: { label: t('aborted'), icon: RiStopLine },
    failed: { label: t('failed'), icon: RiAlertLine },
  };
  const StatusIcon = statusMap[status].icon;
  const label = statusMap[status].label || status;
  return (
    <span
      className={clsx(
        'flex items-center justify-center text-xs rounded-lg h-6 w-6',
        {
          'border-primary text-primary bg-blue-600 animate-pulse':
            status === 'running',
          'border-success text-success': status === 'completed',
          'border-error text-error': status === 'failed',
          'border-warning text-warning': status === 'wait_for_human_input',
          'border-base-content text-base-content': status === 'ready',
        }
      )}
    >
      <StatusIcon className="w-4 h-4" />
    </span>
  );
};

const ChatPane = ({
  chat,
  standalone,
}: {
  chat: ChatType;
  standalone?: boolean;
  onStartChat?: () => void;
}) => {
  const { chatSource } = useChat(chat.id);
  const { sidebarCollapsed, setSidebarCollapsed } = useChats();
  const [status, setStatus] = useState('ready');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [help, setHelp] = useState('');
  const [cleaning, setCleaning] = useState(false);
  const isFirstRender = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations('component.ChatPane');
  const { pinChatPane, chatPanePinned } = useProjectStore();
  const { user } = useUser();

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

  // This is to make sure that the scroll is at the bottom when the messages are updated, such as when
  // user sends a message or when the bot generates a message.
  useEffect(() => {
    // Disable the scroll animation for the first render.
    if (isFirstRender.current) {
      messagesEndRef.current?.scrollIntoView();
      isFirstRender.current = false;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleClean = () => {
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
  };

  const handleSend = async (message: string): Promise<boolean> => {
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
      return false;
    }
    const json = await res.json();
    console.log('message sent:', json);
    return true;
  };

  const handleAbort = async () => {
    const res = await fetch(`/api/chats/${chat.id}/abort`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  };

  // If the chat is not loaded yet, show a button to start the chat.
  if (!chat || chat.id === -1) {
    return (
      <div className="flex flex-col w-full h-full shadow-box rounded-xl bg-gray-700/80 text-base-content border border-gray-600">
        <div className="p-2 flex items-center justify-end">
          <button
            className="btn btn-ghost btn-square btn-xs"
            onClick={() => pinChatPane(!chatPanePinned)}
            data-tooltip-content={chatPanePinned ? t('unpin') : t('pin')}
            data-tooltip-id="chat-tooltip"
          >
            {chatPanePinned ? (
              <RiUnpinLine className="w-4 h-4" />
            ) : (
              <RiPushpinLine className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex flex-grow w-full gap-2 items-center justify-center">
          <RiChatSmile2Line className="w-5 h-5" />
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

  return (
    <div className="flex flex-col w-full h-full shadow-box shadow-gray-700 rounded-xl bg-gray-700/80 text-base-content border border-gray-600">
      <div className="flex items-center justify-between w-full p-2">
        <div className="flex items-center gap-2 text-sm">
          {standalone && (
            <button
              className="btn btn-ghost btn-xs btn-square"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <RiContractRightLine className="w-4 h-4" />
              ) : (
                <RiContractLeftLine className="w-4 h-4" />
              )}
            </button>
          )}
          <span className="line-clamp-1 font-bold">{`${
            chat?.name ?? 'Untitled ' + chat.id
          } ${chatSource?.name ? ' | ' + chatSource?.name : ''}`}</span>
          {status && <StatusTag status={status} />}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-xs btn-ghost btn-square"
            data-tooltip-id="chat-tooltip"
            data-tooltip-content={t('clean-history')}
            onClick={handleClean}
          >
            {cleaning ? (
              <div className="animate-spin h-4 w-4 border-b-2 border-white" />
            ) : (
              <RiBrush3Line className="w-4 h-4" />
            )}
          </button>
          {!standalone && (
            <a
              className="btn btn-xs btn-ghost btn-square"
              data-tooltip-id="chat-tooltip"
              data-tooltip-content={t('open-in-new-window')}
              href={`/chat?id=${chat?.id}`}
              target="_blank"
            >
              <RiPictureInPictureExitLine className="w-4 h-4" />
            </a>
          )}
          {!standalone && chat?.from_type === 'project' && (
            <button
              className="btn btn-ghost btn-square btn-xs"
              onClick={() => pinChatPane(!chatPanePinned)}
              data-tooltip-content={chatPanePinned ? t('unpin') : t('pin')}
              data-tooltip-id="chat-tooltip"
            >
              {chatPanePinned ? (
                <RiUnpinLine className="w-4 h-4" />
              ) : (
                <RiPushpinLine className="w-4 h-4" />
              )}
            </button>
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
              <RiShuffleLine className="w-4 h-4" />
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
          className={clsx(
            'flex items-center p-1 w-full bg-base-100/70 border rounded-lg shadow-lg',
            {
              'border-secondary bg-secondary/40':
                status === 'wait_for_human_input',
              'border-primary ': status !== 'wait_for_human_input',
            }
          )}
          onSend={handleSend}
          status={status}
          onAbort={handleAbort}
        />
        <SampleMessagePanel
          flow={chatSource?.flow}
          className="absolute bottom-full mb-2 right-2 z-20"
          onSelect={handleSend}
        />
      </div>
      <Tooltip id="chat-tooltip" className="max-w-md" />
    </div>
  );
};

export default ChatPane;
