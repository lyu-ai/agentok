import { Chat } from '@/store/chat';
import { useFlows, useTemplates, useChats } from '.';

export function useChat(chatId: number) {
  const { chats, updateChat, isUpdating, isLoading, isError } = useChats();
  const { flows } = useFlows();
  const { templates } = useTemplates();
  const chat = chats.find(chat => chat.id === chatId);
  const chatSource =
    chat?.sourceType === 'flow'
      ? flows && flows.find((flow: any) => flow.id === Number(chat.sourceId))
      : templates &&
        templates.find(
          (template: any) => template.id === Number(chat?.sourceId)
        );

  const collapseSidebar = (collpased: boolean) => {
    updateChat(chatId, { sidebarCollapsed: collpased });
  };
  const handleUpdateChat = (chat: Partial<Chat>) => {
    updateChat(chatId, chat);
  };
  return {
    collapseSidebar,
    chat,
    chatSource,
    updateChat: handleUpdateChat,
    isUpdating,
    isLoading,
    isError,
  };
}
