import { useTranslations } from 'next-intl';
import { BsInboxes } from 'react-icons/bs';
import { useChats, useFlows, useTemplates } from '@/hooks';
import clsx from 'clsx';
import Link from 'next/link';

export const ChatEmpty = () => {
  const t = useTranslations('component.ChatList');
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col gap-2 items-center text-base-content/60">
        <BsInboxes className="w-12 h-12" />
        <div className="mt-2 text-sm">{t('chat-empty')}</div>
      </div>
    </div>
  );
};

export const ChatLoading = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-80 h-12 bg-base-content/10 rounded-md p-3 gap-3"
        >
          <div className="skeleton h-3 w-1/2" />
        </div>
      ))}
    </>
  );
};

const ChatList = ({
  className,
  currentChatId,
}: {
  className?: string;
  currentChatId: number;
}) => {
  const {
    chats,
    isLoading: isLoadingChats,
    isError: isChatsError,
  } = useChats();
  const { flows, isLoading: isLoadingFlows } = useFlows();
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  const t = useTranslations('component.ChatList');

  if (isChatsError) {
    console.warn('Failed to load chats');
  }
  if (isLoadingChats || isLoadingFlows || isLoadingTemplates)
    return <ChatLoading />;
  if (!chats || chats.length === 0) return <ChatEmpty />;

  return (
    <>
      {chats.map(chat => {
        const chatSource =
          chat.sourceType === 'flow'
            ? flows &&
              flows.find((flow: any) => flow.id === Number(chat.sourceId))
            : templates &&
              templates.find(
                (template: any) => template.id === Number(chat.sourceId)
              );

        return (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={clsx(
              'flex flex-col w-80 justify-center gap-2 text-sm font-bold rounded p-2 border hover:shadow-box hover:bg-base-content/40 hover:text-base-content hover:border-base-content/30',
              {
                'border-base-content/20 bg-base-content/30 shadow-box shadow-base-content/20':
                  chat.id === currentChatId,
              },
              {
                'border-base-content/5 bg-base-content/10':
                  chat.id !== currentChatId,
              },
              className
            )}
          >
            <div className="flex w-full gap-2 justify-between items-center">
              <span className="font-bold truncate">
                {chat.name ??
                  t('default-chat-title', {
                    source_name: chatSource?.name,
                  })}
              </span>
              <span className="border border-base-content/40 text-base-content/60 rounded p-1 text-xs">
                {chat.sourceType}
              </span>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default ChatList;
