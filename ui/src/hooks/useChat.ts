import { Chat } from '@/store/chat';
import { useFlows, useTemplates, useChats } from '.';

export function useChat(chatId: string) {
  const { chats, updateChat, isUpdating, isLoading, isError } = useChats();
  const { flows } = useFlows();
  const { templates } = useTemplates();
  const chat = chats.find(chat => chat.id === chatId);
  const chatSource =
    chat?.sourceType === 'flow'
      ? flows && flows.find((flow: any) => flow.id === chat.sourceId)
      : templates &&
        templates.find((template: any) => template.id === chat?.sourceId);

  const handleUpdateChat = (chat: Partial<Chat>) => {
    updateChat(chatId, chat);
  };
  return {
    chat,
    chatSource,
    updateChat: handleUpdateChat,
    isUpdating,
    isLoading,
    isError,
  };
}
