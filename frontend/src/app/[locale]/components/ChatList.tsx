import { useTranslations } from 'next-intl';
import { BsInboxes } from 'react-icons/bs';
import { useChats, useFlows, useTemplates } from '@/hooks';
import clsx from 'clsx';
import Link from 'next/link';
import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import { GoTrash, GoPencil, GoKebabHorizontal } from 'react-icons/go';
import EditableText from '@/components/EditableText';
import { useEffect, useState } from 'react';

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

const ContextButton = ({ chat, onEdit: _onEdit }: any) => {
  const { deleteChat } = useChats();
  const onEdit = (e: any) => {
    e.stopPropagation();
    _onEdit && _onEdit();
  };
  const onDelete = (e: any) => {
    e.stopPropagation();
    deleteChat(chat.id);
    console.log('Delete');
  };
  return (
    <Popover>
      <Float
        placement="bottom"
        offset={5}
        enter="transition ease-out duration-150"
        enterFrom="transform scale-0 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <Popover.Button
          onClick={e => e.stopPropagation()}
          className="hover:text-primary"
        >
          <GoKebabHorizontal className="w-4 h-4" />
        </Popover.Button>
        <Popover.Panel className="origin-top-left w-40 absolute shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-600/80 text-base-content border border-gray-600 max-h-[80vh]">
          {[
            {
              label: 'Edit',
              icon: GoPencil,
              onClick: onEdit,
            },
            {
              label: 'Delete',
              icon: GoTrash,
              onClick: onDelete,
            },
          ].map(({ label, icon: Icon, onClick }) => (
            <Popover.Button
              key={label}
              className="flex items-center w-full p-2 gap-2 rounded-md hover:bg-base-content/20 hover:text-base-content/80 cursor-pointer"
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

const ChatBlock = ({ chat, flows, templates, selected, className }: any) => {
  const t = useTranslations('component.ChatList');
  const [isEditing, setIsEditing] = useState(false);
  const chatSource =
    chat.sourceType === 'flow'
      ? flows && flows.find((flow: any) => flow.id === Number(chat.sourceId))
      : templates &&
        templates.find(
          (template: any) => template.id === Number(chat.sourceId)
        );
  const [title, setTitle] = useState(
    chat.name ??
      t('default-chat-title', {
        source_name: chatSource?.name,
      })
  );
  useEffect(() => {
    setIsEditing(false);
  }, []);
  const onEdit = () => {
    setIsEditing(!isEditing);
    console.log('onEdit');
  };

  return (
    <Link
      key={chat.id}
      href={`/chat/${chat.id}`}
      className={clsx(
        'group flex flex-col w-80 justify-center gap-2 text-sm rounded p-2 border hover:shadow-box hover:bg-base-content/40 hover:text-base-content hover:border-base-content/30',
        {
          'border-base-content/20 bg-base-content/30 shadow-box shadow-base-content/20': selected,
        },
        {
          'border-base-content/5 bg-base-content/10': !selected,
        },
        className
      )}
    >
      <div className="flex w-full gap-2 justify-between items-center">
        <EditableText
          className="font-bold truncate"
          editable={isEditing}
          onModeChange={setIsEditing}
          onChange={setTitle}
          text={title}
        />
        {selected && <ContextButton chat={chat} onEdit={onEdit} />}
      </div>
      <div className="flex items-center gap-1">
        <span className="border border-base-content/40 text-base-content/60 rounded p-1 text-xs">
          {chat.sourceType}
        </span>
      </div>
    </Link>
  );
};

const ChatList = ({
  className,
  maxCount,
  currentChatId,
}: {
  className?: string;
  maxCount?: number;
  currentChatId: number;
}) => {
  const {
    chats,
    isLoading: isLoadingChats,
    isError: isChatsError,
  } = useChats();
  const { flows, isLoading: isLoadingFlows } = useFlows();
  const { templates, isLoading: isLoadingTemplates } = useTemplates();

  if (isChatsError) {
    console.warn('Failed to load chats');
  }
  if (isLoadingChats || isLoadingFlows || isLoadingTemplates)
    return <ChatLoading />;
  if (!chats || chats.length === 0) return <ChatEmpty />;
  let reversedChats = [...chats].reverse();

  if (maxCount) {
    reversedChats = reversedChats.slice(0, maxCount);
  }
  return (
    <>
      {reversedChats.map((chat: any) => (
        <ChatBlock
          key={chat.id}
          chat={chat}
          selected={currentChatId === chat.id}
          flows={flows}
          templates={templates}
          className={className}
        />
      ))}
    </>
  );
};

export default ChatList;
