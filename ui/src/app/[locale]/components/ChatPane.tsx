import { useCallback, useEffect, useRef, useState } from 'react';
import { GoArrowDown, GoArrowUp, GoPencil } from 'react-icons/go';
import { MdOutlineCleaningServices } from 'react-icons/md';
import { RxOpenInNewWindow } from 'react-icons/rx';
import ChatInput from './ChatInput';
import { genId } from '@/utils/id';
import { UnsubscribeFunc } from 'pocketbase';
import pb from '@/utils/pocketbase/client';
import { StatusMessage } from '@/utils/chat';
import { TbArrowBarToLeft, TbArrowBarRight } from 'react-icons/tb';
import { useTranslations } from 'next-intl';
import { useChat, useChats } from '@/hooks';
import { Tooltip } from 'react-tooltip';
import MessageList from './MessageList';
import clsx from 'clsx';
import Tip from './Tip';
import { isArray } from 'lodash-es';
import useFlowStore from '@/store/flows';
import { RiPushpinLine, RiUnpinLine } from 'react-icons/ri';

const SampleMessagePanel = ({ flow, className, onSelect: _onSelect }: any) => {
  const t = useTranslations('component.ChatPane');
  const [minimized, setMinimized] = useState(false);
  const config = flow?.nodes?.find((node: any) => node.type === 'config');
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
        {minimized ? <GoArrowUp /> : <GoArrowDown />}
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

const ChatPane = ({
  chatId,
  standalone,
  onStartChat,
}: {
  chatId: string;
  standalone?: boolean;
  onStartChat?: () => void;
}) => {
  const { chat, isLoading: isLoadingChat, isError, chatSource } = useChat(
    chatId
  );
  const { sidebarCollapsed, setSidebarCollapsed } = useChats();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [help, setHelp] = useState('');
  const [waitForHumanInput, setWaitForHumanInput] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const isFirstRender = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations('component.ChatPane');
  const { pinChatPane, chatPanePinned } = useFlowStore();

  const fetchMessages = useCallback(async () => {
    return fetch(`/api/chats/${chatId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(resp => resp.json())
      .then(json => {
        setMessages(json ? json : []);
      });
  }, [setMessages, chatId]);

  const extractHelp = useCallback(() => {
    const noteNode = chatSource?.flow?.nodes?.find(
      (node: any) => node.type === 'note'
    );
    if (noteNode) {
      setHelp(noteNode.data.content);
    }
  }, [chatSource]);

  useEffect(() => {
    fetchMessages().finally(() => setLoading(false));

    extractHelp();

    let unsubscribFunc: UnsubscribeFunc | undefined;
    pb.collection('messages')
      .subscribe('*', payload => {
        // console.log('changes_event:', payload);
        if (payload.record.type !== 'user') {
          // The user message was added when sending, no need to add it again.
          setMessages(msgs =>
            msgs.some(m => m.id === payload.record.id)
              ? msgs
              : [...msgs, payload.record as any]
          ); // Avoid duplicate messages
        }
        const content = payload.record.content;
        if (content.startsWith(StatusMessage.running)) {
          // console.log('Begin thinking');
          setThinking(true);
        } else if (content.startsWith(StatusMessage.completed)) {
          setThinking(false);
          setWaitForHumanInput(false);
          // console.log('End thinking');
        } else if (content.startsWith(StatusMessage.waitForHumanInput)) {
          setWaitForHumanInput(true);
        } else if (content.startsWith(StatusMessage.receivedHumanInput)) {
          // BUG: This does not happen as expected
          setWaitForHumanInput(false);
        }
      })
      .then(unsubFunc => {
        unsubscribFunc = unsubFunc;
      });

    return () => {
      if (unsubscribFunc) {
        unsubscribFunc();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

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

  const onClean = () => {
    setCleaning(true);
    fetch(`/api/chats/${chatId}/messages`, {
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

  const onSend = async (message: string): Promise<boolean> => {
    const newMessage = {
      type: 'user',
      id: genId(),
      chat: chatId,
      content: message ?? '\n', // If it's empty message, let's simulate a Enter key-press
    };
    setMessages(msgs => [...msgs, newMessage]);
    setThinking(true); // Activate thinking immediately
    const res = await fetch(
      `/api/chats/${chatId}/${waitForHumanInput ? 'input' : 'messages'}`,
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

  // If the chat is not loaded yet, show a button to start the chat.
  if (!chatId) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <button className="btn btn-primary" onClick={onStartChat}>
          {t('start-chat')}
        </button>
      </div>
    );
  }

  if (loading || isLoadingChat) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="loading loading-bars loading-sm" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <span className="mt-2 text-sm text-red-500">
          Failed to load chat: {chatId}
        </span>
      </div>
    );
  }

  let messagesToDisplay = [...messages];
  if (!waitForHumanInput && thinking) {
    messagesToDisplay.push({
      id: genId(),
      type: 'assistant',
      chat: chatId,
      content: t('thinking'),
    });
  }

  return (
    <div className="flex flex-col w-full h-full z-10 shadow-box shadow-gray-700 rounded-xl bg-gray-700/80 text-base-content border border-gray-600">
      <div className="flex items-center justify-between w-full p-2">
        <div className="flex items-center gap-2 text-sm">
          {standalone && (
            <button
              className="btn btn-ghost btn-xs btn-square"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <TbArrowBarRight className="w-4 h-4" />
              ) : (
                <TbArrowBarToLeft className="w-4 h-4" />
              )}
            </button>
          )}
          <span className="line-clamp-1 font-bold">{`${
            chat?.name ?? 'Untitled ' + chatId
          } ${chatSource?.name ? ' | ' + chatSource?.name : ''}`}</span>
          {help && (
            <Tip content={help} className="mx-2" data-tooltip-place="bottom" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-xs btn-ghost btn-square"
            data-tooltip-id="chat-tooltip"
            data-tooltip-content={t('clean-history')}
            onClick={onClean}
          >
            {cleaning ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <MdOutlineCleaningServices className="w-4 h-4" />
            )}
          </button>
          {!standalone && (
            <a
              className="btn btn-xs btn-ghost btn-square"
              data-tooltip-id="chat-tooltip"
              data-tooltip-content={t('open-in-new-window')}
              href={`/chats/${chat?.id}`}
              target="_blank"
            >
              <RxOpenInNewWindow className="w-4 h-4" />
            </a>
          )}
          {!standalone && chat?.sourceType === 'flow' && (
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
          {standalone && chat?.sourceType === 'flow' && (
            <a
              className="btn btn-sm btn-ghost btn-square"
              data-tooltip-id="chat-tooltip"
              data-tooltip-content={t('go-to-editor')}
              data-tooltip-place="bottom"
              href={`/flows/${chat.sourceId}`}
              target="_blank"
            >
              <GoPencil className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
      <div className="relative flex mx-auto w-full flex-grow flex-col overflow-y-auto p-1 font-normal">
        <MessageList
          chatId={chatId}
          messages={messagesToDisplay}
          onSend={onSend}
        />
        <div ref={messagesEndRef} id="chat-messages-bottom"></div>
      </div>
      <div className="relative justify-center w-full p-1 font-normal">
        <ChatInput
          className={clsx(
            'flex items-center p-1 w-full bg-base-100/70 border rounded-lg shadow-lg',
            {
              'border-secondary bg-secondary/40': waitForHumanInput,
              'border-primary ': !waitForHumanInput,
            }
          )}
          onSend={onSend}
        />
        {thinking && !waitForHumanInput && (
          <div className="absolute inset-1.5 rounded-md backdrop-blur-sm bg-primary/10">
            <div className="flex w-full h-full items-center justify-center gap-2 text-primary">
              <div className="loading loading-infinity loading-sm" />
              <span className="text-sm">{t('thinking')}</span>
            </div>
          </div>
        )}
        <SampleMessagePanel
          flow={chatSource?.flow}
          className="absolute bottom-full mb-2 right-2 z-20"
          onSelect={onSend}
        />
      </div>
      <Tooltip id="chat-tooltip" className="max-w-md" />
    </div>
  );
};

export default ChatPane;
