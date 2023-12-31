import { useTranslations } from 'next-intl';
import { BsInboxes } from 'react-icons/bs';
import { useChat, useChats, useFlows, useTemplates } from '@/hooks';
import clsx from 'clsx';
import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import { PiChatsCircle, PiChatsCircleFill } from 'react-icons/pi';
import { GoTrash, GoPencil, GoKebabHorizontal } from 'react-icons/go';
import EditableText from '@/components/EditableText';
import { useState, useEffect, useRef, createRef, forwardRef } from 'react';
import { useRouter } from 'next/navigation';

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
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col w-80 h-20 bg-base-content/10 rounded-md p-3 gap-3"
        >
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-1/3" />
        </div>
      ))}
    </>
  );
};

const ContextButton = ({ className, onDelete, onEdit }: any) => {
  const t = useTranslations('component.ChatList');
  return (
    <Popover>
      <Float
        placement="bottom-end"
        offset={5}
        shift={5}
        flip
        enter="transition ease-out duration-150"
        enterFrom="transform scale-0 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <Popover.Button
          onClick={e => e.stopPropagation()}
          className={clsx('btn btn-xs btn-circle', className)}
        >
          <GoKebabHorizontal className="w-4 h-4" />
        </Popover.Button>
        <Popover.Panel className="origin-top-right w-40 shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-600/80 text-base-content border border-gray-500 max-h-[80vh]">
          {[
            {
              label: t('edit-chat-name'),
              icon: GoPencil,
              onClick: onEdit,
            },
            {
              label: t('delete-chat'),
              icon: GoTrash,
              onClick: onDelete,
              className: 'text-red-500',
            },
          ].map(({ label, icon: Icon, className, onClick }) => (
            <Popover.Button
              key={label}
              className={clsx(
                'flex items-center w-full p-2 gap-2 rounded-md hover:bg-base-content/20 cursor-pointer',
                className
              )}
              onClick={onClick}
            >
              <Icon className="w-4 h-4" />
              <span className="font-normal">{label}</span>
            </Popover.Button>
          ))}
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

interface ChatBlockProps {
  chatId: string;
  disableSelection: boolean;
  className?: string;
  // ... any other props
}

const ChatBlock = forwardRef<HTMLDivElement, ChatBlockProps>(
  ({ chatId, className, disableSelection }: any, ref) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const { chat, isLoading, chatSource } = useChat(chatId);
    const {
      chats,
      setActiveChat,
      activeChat,
      updateChat,
      deleteChat,
    } = useChats();
    const selected = activeChat === chatId && !disableSelection;

    const onEditStarted = () => {
      setIsEditing(true);
    };
    const onEditCompleted = (newText: string) => {
      setIsEditing(false);
      updateChat(chatId, { name: newText });
    };
    const onDelete = async () => {
      if (!chat || !chats) {
        console.warn('Chat not found', chatId);
        return;
      }
      const currentIndex = chats.findIndex(c => c.id === chat.id);
      if (currentIndex < 0) {
        console.warn('Chat not found', chat.id);
        return;
      }
      let nextChatId = '';
      if (currentIndex < chats.length - 1) {
        // Has next one
        nextChatId = chats[currentIndex + 1].id;
      } else if (currentIndex > 1) {
        // The current selection is the last and has previous one
        nextChatId = chats[currentIndex - 1].id;
      }
      setActiveChat(nextChatId);
      await deleteChat(chat.id);
      router.replace(`/chat/${nextChatId}`); // It's fine if nextChatId is empty
    };

    if (!chat || isLoading) return <ChatLoading />;

    return (
      <div
        key={chat.id}
        ref={ref}
        className={clsx(
          'group flex flex-col w-80 justify-center gap-2 text-sm rounded p-2 border cursor-pointer',
          'hover:shadow-box hover:bg-base-content/40 hover:text-base-content hover:border-base-content/30',
          {
            'border-base-content/20 bg-base-content/30 shadow-box shadow-base-content/20': selected,
            'border-base-content/5 bg-base-content/10': !selected,
          },
          className
        )}
        onClick={() => {
          setActiveChat(chat.id);
          router.push(`/chat/${chat.id}`);
        }}
      >
        <div className="relative flex flex-col w-full gap-2 justify-between items-start">
          <div className="flex items-center gap-1">
            <PiChatsCircleFill className="w-7 h-7 flex-0" />
            <div className="flex flex-col items-start">
              <EditableText
                className="font-bold nowrap line-clamp-1 truncate w-64"
                editing={isEditing}
                onChange={onEditCompleted}
                text={chat.name ?? chatSource?.name ?? 'Untitled ' + chat.id}
              />
              <div className="text-xs text-base-content/60 px-2">
                {chat.created && new Date(chat.created).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-sm text-base-content/80 h-10 line-clamp-2">
            {chatSource?.description}
          </div>
          <div
            className={clsx(
              'join flex items-center border border-base-content/40 text-xs rounded ',
              {
                'border-primary/40 text-primary/40 bg-primary/5':
                  chat.sourceType === 'flow',
                'border-secondary/40 text-secondary/40 bg-primary/5':
                  chat.sourceType === 'template',
              }
            )}
          >
            <span
              className={clsx('join-item px-2 py-0.5 border-r ', {
                'border-primary/40': chat.sourceType === 'flow',
                'border-secondary/40': chat.sourceType === 'template',
              })}
            >
              {chat.sourceType}
            </span>
            <span className="join-item line-clamp-1 px-2 py-0.5">
              {chatSource?.name ?? ''}
            </span>
          </div>
          {selected && (
            <div className="absolute top-0 right-0">
              <ContextButton
                chat={chat}
                onEdit={onEditStarted}
                onDelete={onDelete}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

ChatBlock.displayName = 'ChatBlock';

const ChatList = ({
  className,
  maxCount,
  filter,
  horitontal = false,
  disableSelection = false,
}: {
  className?: string;
  maxCount?: number;
  filter?: string;
  horitontal?: boolean;
  disableSelection?: boolean;
}) => {
  const {
    chats,
    isLoading: isLoadingChats,
    isError: isChatsError,
    activeChat,
  } = useChats();
  const { templates } = useTemplates();
  const { flows } = useFlows();
  const chatListRef = useRef<HTMLDivElement | null>(null); // This ref should attach to the chat list container

  const autoScrollIntoView = (targetElement: any, containerElement: any) => {
    const targetRect = targetElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();

    if (
      targetRect.bottom <= containerRect.top ||
      targetRect.top >= containerRect.bottom
    ) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  const [filteredChats, setFilteredChats] = useState<any[]>([]);
  const chatRefs = useRef(new Map()).current;
  useEffect(() => {
    if (!chatListRef.current) return;
    if (isLoadingChats) return;
    if (
      activeChat &&
      chatRefs.has(activeChat) &&
      chatRefs.size === chats.length
    ) {
      const activeChatRef = chatRefs.get(activeChat);
      if (!activeChatRef.current) {
        console.warn('Active chat ref not found');
        return;
      }
      autoScrollIntoView(activeChatRef.current, chatListRef.current);
    }
  }, [isLoadingChats, activeChat, chatRefs, chats]);
  useEffect(() => {
    if (!chats) return;
    if (!filter) {
      setFilteredChats(chats);
      return;
    }
    let newChats = chats.filter((chat: any) => {
      if (chat.name?.toLowerCase().includes(filter.toLowerCase())) return true;
      const chatSource =
        chat.sourceType === 'template'
          ? templates?.find(t => t.id === chat.sourceId)
          : flows?.find(f => f.id === chat.sourceId);
      return chatSource?.name?.toLowerCase().includes(filter.toLowerCase());
    });
    if (maxCount) {
      newChats = newChats.slice(0, maxCount);
    }
    setFilteredChats(newChats);
  }, [chats, filter, setFilteredChats, maxCount, templates, flows]);

  if (isChatsError) {
    console.warn('Failed to load chats');
  }
  if (isLoadingChats) return <ChatLoading />;
  if (!chats || chats.length === 0) return <ChatEmpty />;

  return (
    <div
      ref={chatListRef}
      className={clsx(
        'flex w-full h-full',
        horitontal ? 'flex-wrap justify-center gap-4' : 'flex-col gap-1'
      )}
    >
      {filteredChats.map((chat: any) => {
        if (!chatRefs.has(chat.id)) {
          chatRefs.set(chat.id, createRef<HTMLDivElement>());
        }
        return (
          <ChatBlock
            key={chat.id}
            ref={chatRefs.get(chat.id)}
            chatId={chat.id}
            className={className}
            disableSelection={disableSelection}
          />
        );
      })}
    </div>
  );
};

export default ChatList;
