import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GoAlert,
  GoCheckCircle,
  GoMegaphone,
  GoPencil,
  GoPersonFill,
  GoShare,
} from 'react-icons/go';
import { RiRobot2Fill, RiRobot2Line } from 'react-icons/ri';
import { MdOutlineCleaningServices } from 'react-icons/md';
import { IoReload } from 'react-icons/io5';
import { RxReload } from 'react-icons/rx';
import ChatInput from './ChatInput';
import Markdown from '@/components/Markdown';
import { genId } from '@/utils/id';
import { UnsubscribeFunc } from 'pocketbase';
import pb from '@/utils/pocketbase/client';
import { stripMatch } from '@/utils/re';
import { ThinkTag } from '@/utils/chat';
import { PiChatsCircleFill } from 'react-icons/pi';
import { TbArrowBarToLeft, TbArrowBarRight } from 'react-icons/tb';
import { useTranslations } from 'next-intl';
import { useChat, useChats } from '@/hooks';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const Chat = ({
  chatId,
  standalone,
}: {
  chatId: string;
  standalone?: boolean;
}) => {
  const { chat, isLoading: isLoadingChat, isError } = useChat(chatId);
  const { sidebarCollapsed, setSidebarCollapsed } = useChats();

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const isFirstRender = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations('component.Chat');

  const fetchMessages = useCallback(
    () =>
      fetch(`/api/chats/${chat!.id}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(resp => resp.json())
        .then(json => {
          setMessages(json ? json : []);
        }),
    [setMessages, chat?.id]
  );

  useEffect(() => {
    if (!chat) return;
    fetchMessages().finally(() => setLoading(false));
    pb.collection('messages').subscribe('*', payload => {
      console.log('changes_event:', payload);
      if (payload.record.type !== 'user') {
        // The user message was added when sending, no need to add it again.
        setMessages(msgs =>
          msgs.some(m => m.id === payload.record.id)
            ? msgs
            : [...msgs, payload.record as any]
        ); // Avoid duplicate messages
      }
      const content = payload.record.content;
      if (content.startsWith(ThinkTag.begin)) {
        console.log('Begin thinking');
        setThinking(true);
      } else if (content.startsWith(ThinkTag.end)) {
        setThinking(false);
        console.log('End thinking');
      }
    });

    return () => {
      pb.collection('messages').unsubscribe('*');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    fetch(`/api/chats/${chat!.id}/messages`, {
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

  const onReload = () => {
    setLoading(true);
    setMessages([]);
    fetchMessages().finally(() => setLoading(false));
  };

  const onSend = async (message: string): Promise<boolean> => {
    if (!chat) return false;
    const newMessage = {
      type: 'user',
      id: genId(),
      chat: chat?.id,
      content: message,
    };
    setMessages(msgs => [...msgs, newMessage]);
    const res = await fetch(`/api/chats/${chat!.id}/messages`, {
      method: 'POST',
      body: JSON.stringify(newMessage),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      console.warn('Failed sending message:', res.statusText);
      return false;
    }
    const json = await res.json();
    console.log('message sent:', json);
    return true;
  };

  let messagesToDisplay = messages;
  if (thinking) {
    messagesToDisplay = [
      ...messages,
      {
        id: genId(),
        type: 'assistant',
        chat: chat?.id,
        content: t('thinking'),
      },
    ];
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

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="flex items-center justify-between w-full px-2 py-1">
        <div className="flex items-center gap-2 text-sm font-bold">
          {standalone && (
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <TbArrowBarRight className="w-5 h-5" />
              ) : (
                <TbArrowBarToLeft className="w-5 h-5" />
              )}
            </button>
          )}
          <PiChatsCircleFill className="w-5 h-5" />
          {/* <span>{t('start-chat') + (flow?.name ? ' - ' + flow.name : '')}</span> */}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-ghost btn-square"
            data-tooltip-id="chat-tooltip"
            data-tooltip-content={t('reload-history')}
            onClick={onReload}
          >
            <RxReload className="w-4 h-4" />
          </button>
          <button
            className="btn btn-sm btn-ghost btn-square"
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
              className="btn btn-sm btn-ghost btn-square"
              data-tooltip-id="chat-tooltip"
              data-tooltip-content={t('share')}
              href={`/chat/${chat?.id}`}
              target="_blank"
            >
              <GoShare className="w-4 h-4" />
            </a>
          )}
          {standalone && chat?.sourceType === 'flow' && (
            <a
              className="btn btn-sm btn-ghost btn-square"
              data-tooltip-id="chat-tooltip"
              data-tooltip-content={t('go-to-editor')}
              href={`/flow/${chat.sourceId}`}
              target="_blank"
            >
              <GoPencil className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
      <div className="relative flex mx-auto w-full max-w-[640px] flex-grow flex-col overflow-y-auto p-1">
        {/* {loading && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="loading loading-bars loading-sm" />
            <span className="mt-2 text-sm">{t('message-loading')}</span>
          </div>
        )} */}
        {messagesToDisplay.length === 0 && !loading && (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-sm text-base-content/50">
              {t('message-empty')}
            </div>
          </div>
        )}
        {messagesToDisplay.map((message: any) => {
          const { found, text: resultText } = stripMatch(
            message.content,
            ThinkTag.end
          );
          const success = found && resultText.startsWith('DONE');
          const ResultIcon = success ? GoCheckCircle : GoAlert;
          const resultClass = success ? 'text-green-500' : 'text-red-500/50';
          if (found) {
            return (
              <div
                key={message.id}
                className="divider my-2 text-sm"
                data-tooltip-id="chat-tooltip"
                data-tooltip-content={resultText}
                data-tooltip-place="top"
              >
                <div
                  className={`flex items-center gap-1 cursor-pointer ${resultClass}`}
                >
                  <ResultIcon className="w-4 h-4" />
                  <span>{t('thinking-end')}</span>
                </div>
              </div>
            );
          } else if (message.content.startsWith(ThinkTag.begin)) {
            return (
              <div
                key={message.id}
                className="divider my-2 text-sm text-base-content/30"
              >
                <div className="flex items-center gap-1 cursor-pointer">
                  <RiRobot2Line className="w-4 h-4" />
                  <span>{t('thinking-begin')}</span>
                </div>
              </div>
            );
          }

          const messageClass =
            message.type === 'assistant'
              ? 'bg-base-content/20 text-white'
              : 'bg-primary/70 text-white';
          const AvatarIcon =
            message.type === 'assistant' ? RiRobot2Fill : GoPersonFill;

          return (
            <div
              key={message.id}
              className={`chat gap-x-1 lg:gap-x-2 chat-start`}
            >
              <div className="chat-image text-base-content/50">
                <div
                  className={`w-8 h-8 rounded-full ${messageClass} flex items-center justify-center`}
                >
                  <AvatarIcon className="w-5 h-5 text-base-content" />
                </div>
              </div>
              {message.from && (
                <div className="chat-header w-full flex items-end gap-2 text-sm p-1 text-base-content/80">
                  <div className="flex items-center gap-1">
                    {message.sender}
                    {message.receiver && (
                      <>
                        <GoMegaphone className="w-3 h-3 inline-block mx-1" />
                        <span className=" text-base-content/50">
                          {message.receiver}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-base-content/20 text-xs">
                    {new Date(message.created).toLocaleString()}
                  </div>
                </div>
              )}
              <div
                className={`relative group chat-bubble rounded-md p-2 ${messageClass} break-words`}
              >
                <Markdown>{message.content}</Markdown>
                {message.type === 'user' && (
                  <div className="hidden group-hover:block absolute right-1 bottom-1">
                    <button
                      className="btn btn-xs btn-ghost btn-square"
                      onClick={() => onSend(message.content)}
                    >
                      <IoReload className="w-4 h-4 text-gray-200/20 group-hover:text-gray-200" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} id="chat-messages-bottom"></div>
      </div>
      <div className="relative justify-center w-full max-w-[640px] mx-auto p-1">
        <ChatInput
          className="flex items-center p-1 w-full bg-base-100/70 border border-primary rounded-lg shadow-lg"
          onSend={onSend}
        />
        {thinking && (
          <div className="absolute inset-1 rounded-md backdrop-blur-sm bg-gray-700/70">
            <div className="flex w-full h-full items-center justify-center gap-2 text-gray-300">
              <div className="loading loading-infinity loading-sm" />
              <span className="text-sm">{t('thinking')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;