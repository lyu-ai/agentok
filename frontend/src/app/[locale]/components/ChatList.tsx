import { useTranslations } from 'next-intl';
import { BsInboxes } from 'react-icons/bs';
import { useChats, useFlows, useTemplates } from '@/hooks';

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
    <div className="flex flex-wrap justify-center gap-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="group relative  w-80 h-48 flex flex-col bg-base-content/10 rounded-md p-3 gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="skeleton w-6 h-6 rounded-full shrink-0" />
            <div className="skeleton h-4 w-1/2" />
          </div>
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
};

const ChatBlock = ({ chat }: any) => {
  const t = useTranslations('component.ChatList');
  const { flows, isLoading: isLoadingFlows } = useFlows();
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  if (isLoadingFlows || isLoadingTemplates) return <ChatLoading />;
  const source =
    chat.sourceType === 'flow'
      ? flows?.find((flow: any) => flow.id === chat.sourceId)
      : templates?.find((template: any) => template.id === chat.sourceId);
  if (!source) return <ChatLoading />;
  return (
    <div className="card flex flex-col w-80 items-center justify-center gap-2 text-sm font-bold p-2 border">
      <span className="break-all p-4">{source.name}</span>
      <span className="text-xs font-bold p-4">{chat.sourceType}</span>
    </div>
  );
};

const ChatList = () => {
  const { chats, isLoading, isError } = useChats();
  const t = useTranslations('component.ChatList');

  if (isError) {
    console.warn('Failed to load flow');
  }
  if (isLoading) return <ChatLoading />;
  if (!chats || chats.length === 0) return <ChatEmpty />;

  return (
    <div className="flex flex-wrap justify-center gap-4 p-2">
      {chats.map((chat: any) => (
        <ChatBlock key={chat.id} chat={chat} />
      ))}
    </div>
  );
};

export default ChatList;
