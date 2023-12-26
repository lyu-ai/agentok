import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GoAlert,
  GoCheckCircle,
  GoMegaphone,
  GoPencil,
  GoPersonFill,
} from 'react-icons/go';
import { RiRobot2Fill, RiRobot2Line } from 'react-icons/ri';
import { MdOutlineCleaningServices, MdOpenInBrowser } from 'react-icons/md';
import { RxOpenInNewWindow } from 'react-icons/rx';
import { IoReload } from 'react-icons/io5';
import ChatInput from './ChatInput';
import Markdown from '@/components/Markdown';
import { genId } from '@/utils/id';
import { UnsubscribeFunc } from 'pocketbase';
import pb, { getAvatarUrl } from '@/utils/pocketbase/client';
import { stripMatch } from '@/utils/re';
import { ThinkTag } from '@/utils/chat';
import { PiChatsCircleFill } from 'react-icons/pi';
import { TbArrowBarToLeft, TbArrowBarRight } from 'react-icons/tb';
import { useTranslations } from 'next-intl';
import { useChat, useChats } from '@/hooks';
import { Tooltip } from 'react-tooltip';

const Chat = ({
  chatId,
  standalone,
}: {
  chatId: string;
  standalone?: boolean;
}) => {
  const { chat, isLoading: isLoadingChat, isError, chatSource } = useChat(
    chatId
  );
  const { sidebarCollapsed, setSidebarCollapsed } = useChats();

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const isFirstRender = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations('component.Chat');

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

  useEffect(() => {
    if (!chat) return;
    fetchMessages().finally(() => setLoading(false));
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
        if (content.startsWith(ThinkTag.begin)) {
          // console.log('Begin thinking');
          setThinking(true);
        } else if (content.startsWith(ThinkTag.end)) {
          setThinking(false);
          // console.log('End thinking');
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
  }, [chat]);

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
    if (!chat) return;
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

  const onSend = async (message: string): Promise<boolean> => {
    if (!chat) return false;
    const newMessage = {
      type: 'user',
      id: genId(),
      chat: chat?.id,
      content: message,
    };
    setMessages(msgs => [...msgs, newMessage]);
    const res = await fetch(`/api/chats/${chat.id}/messages`, {
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
  if (thinking) {
    messagesToDisplay.push({
      id: genId(),
      type: 'assistant',
      chat: chat?.id,
      content: t('thinking'),
    });
  }

  const userNodeName =
    chatSource?.flow?.nodes?.find(
      (node: any) =>
        node.data.class === 'UserProxyAgent' ||
        node.data.class === 'RetrieveUserProxyAgent'
    )?.data?.name ?? '';

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
          <PiChatsCircleFill className="w-5 h-5 shrink-0" />
          <span className="line-clamp-1">{`${
            chat?.name ?? 'Untitled ' + chatId
          } ${chatSource?.name ? ' | ' + chatSource?.name : ''}`}</span>
        </div>
        <div className="flex items-center gap-2">
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
              data-tooltip-content={t('open-in-new-window')}
              href={`/chat/${chat?.id}`}
              target="_blank"
            >
              <RxOpenInNewWindow className="w-4 h-4" />
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
      <div className="relative flex mx-auto w-full flex-grow flex-col overflow-y-auto p-1 font-normal">
        {/* {loading && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="loading loading-bars loading-sm" />
            <span className="mt-2 text-sm">{t('message-loading')}</span>
          </div>
        )} */}
        {messagesToDisplay.length === 0 && !loading && (
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex flex-col items-center gap-2 text-sm text-base-content/20">
              <RiRobot2Line className="w-12 h-12" />
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
              ? 'bg-base-content/20 text-base-content'
              : 'bg-primary/80 text-white';

          let avatarIcon = <RiRobot2Fill className="w-5 h-5" />;
          if (message.type === 'user') {
            avatarIcon = pb.authStore.model?.avatar ? (
              <img
                alt="avatar"
                src={getAvatarUrl(pb.authStore.model as any)}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <GoPersonFill className="w-5 h-5" />
            );
          } else if (message.sender === userNodeName) {
            avatarIcon = <GoPersonFill className="w-5 h-5" />;
          }

          return (
            <div key={message.id} className={`chat gap-x-1 chat-start`}>
              <div className="chat-image text-base-content/50">
                <div
                  className={`w-8 h-8 rounded-full ${messageClass} flex items-center justify-center`}
                >
                  {avatarIcon}
                </div>
              </div>
              {message.sender && (
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
                className={`relative group chat-bubble rounded-md p-2 ${messageClass} break-all`}
                style={{ maxWidth: '100%' }}
              >
                {message.content ? (
                  <Markdown>{message.content}</Markdown>
                ) : (
                  <span className="text-lime-600">(Empty Message)</span>
                )}
                {message.type === 'user' && (
                  <div className="hidden group-hover:block absolute right-1 bottom-1">
                    <button
                      className="btn btn-xs btn-ghost btn-square group-hover:bg-yellow-600"
                      data-tooltip-content={t('resend')}
                      data-tooltip-id="chat-tooltip"
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
      <div className="relative justify-center w-full p-1 font-normal">
        <ChatInput
          className="flex items-center p-1 w-full bg-base-100/70 border border-primary rounded-lg shadow-lg"
          onSend={onSend}
        />
        {thinking && (
          <div className="absolute inset-1.5 rounded-sm backdrop-blur-sm bg-primary/10">
            <div className="flex w-full h-full items-center justify-center gap-2 text-primary">
              <div className="loading loading-infinity loading-sm" />
              <span className="text-sm">{t('thinking')}</span>
            </div>
          </div>
        )}
      </div>
      <Tooltip id="chat-tooltip" />
    </div>
  );
};

export default Chat;
