import { Chat } from '@/store/chats';
import { useProjects, useTemplates, useChats } from '.';

export function useChat(chatId: number) {
  const { chats, updateChat, isUpdating, isLoading, isError } = useChats();
  const { projects } = useProjects();
  const { templates } = useTemplates();
  const chat = chats.find(chat => chat.id === chatId);
  const chatSource =
    chat?.sourceType === 'project'
      ? projects &&
      projects.find((project: any) => project.id === chat.sourceId)
      : templates &&
      templates.find((template: any) => template.id === chat?.sourceId)
        ?.project;

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
