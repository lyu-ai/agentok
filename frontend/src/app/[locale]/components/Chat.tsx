import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GoAlert,
  GoCheckCircle,
  GoMegaphone,
  GoPencil,
  GoPersonFill,
  GoShareAndroid,
} from 'react-icons/go';
import { RiRobot2Fill, RiRobot2Line } from 'react-icons/ri';
import { MdOutlineCleaningServices } from 'react-icons/md';
import { IoReload } from 'react-icons/io5';
import { RxReload } from 'react-icons/rx';
import ChatInput from './ChatInput';
import Markdown from '@/components/Markdown';
import { genId } from '@/utils/id';
import { createClient } from '@/utils/supabase/client';
import { stripMatch } from '@/utils/re';
import { ThinkTag } from '@/utils/chat';
import { PiChatsCircleFill } from 'react-icons/pi';
import { useTranslations } from 'next-intl';

const supabase = createClient();

const Chat = ({ flow, standalone }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const isFirstRender = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations('component.Chat');

  const fetchMessages = useCallback(
    () =>
      fetch(`/api/flows/${flow.id}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(resp => resp.json())
        .then(json => {
          setMessages(json ? json : []);
        }),
    [setMessages, flow?.id]
  );

  useEffect(() => {
    if (!flow) return;
    fetchMessages().finally(() => setLoading(false));
    const subscription = supabase
      .channel('flowgen')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        payload => {
          console.log('changes_event:', payload);
          if (payload.new.type !== 'user') {
            // The user message was added when sending, no need to add it again.
            setMessages(msgs => [...msgs, payload.new as any]);
          }
          const content = (payload.new as any).content;
          if (content.startsWith(ThinkTag.begin)) {
            console.log('Begin thinking');
            setThinking(true);
          } else if (content.startsWith(ThinkTag.end)) {
            setThinking(false);
            console.log('End thinking');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
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
    fetch(`/api/flows/${flow.id}/messages`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const newMessage = {
      type: 'user',
      id: genId(),
      session: flow?.id,
      content: message,
    };
    setMessages(msgs => [...msgs, newMessage]);
    const res = await fetch(`/api/flows/${flow.id}/messages`, {
      method: 'POST',
      body: JSON.stringify(newMessage),
      headers: {
        'Content-Type': 'application/json',
      },
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
        content: t('thinking'),
      },
    ];
  }

  if (!flow?.flow) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <title>FlowGen Chat</title>
      <div className="flex items-center justify-between w-full px-2 py-1">
        <div className="flex items-center gap-2 text-sm font-bold">
          <PiChatsCircleFill className="w-5 h-5" />
          <span>{t('start-chat') + (flow?.name ? ' - ' + flow.name : '')}</span>
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
              href={`/chat/${flow.id}`}
              target="_blank"
            >
              <GoShareAndroid className="w-4 h-4" />
            </a>
          )}
          {standalone && (
            <a
              className="btn btn-sm btn-ghost btn-square"
              data-tooltip-id="chat-tooltip"
              data-tooltip-content={t('go-to-editor')}
              href={`/flow/${flow.id}`}
            >
              <GoPencil className="w-4 h-4" />
            </a>
          )}{' '}
        </div>
      </div>
      <div className="relative flex flex-grow flex-col overflow-y-auto p-1">
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
          const alignRight = message.type === 'user';
          const AvatarIcon =
            message.type === 'assistant' ? RiRobot2Fill : GoPersonFill;

          return (
            <div
              key={message.id}
              className={`chat gap-x-1 lg:gap-x-2 ${
                alignRight ? 'chat-end' : 'chat-start'
              }`}
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
                    {message.from}
                    {message.to && (
                      <>
                        <GoMegaphone className="w-3 h-3 inline-block mx-1" />
                        <span className=" text-base-content/50">
                          {message.to}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-base-content/20 text-xs">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </div>
                </div>
              )}
              <div
                className={`relative group chat-bubble rounded-md p-2 ${messageClass} break-words`}
              >
                <Markdown>{message.content}</Markdown>
                {alignRight && (
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
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="loading loading-bars loading-sm" />
            <span className="mt-2 text-sm">{t('message-loading')}</span>
          </div>
        )}
      </div>
      <div className="relative p-1">
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
