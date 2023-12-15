import { create } from 'zustand';

export interface Chat {
  id: string;
  name: string;
  sourceId: string; // Binded flow
  sourceType: 'flow' | 'template';
  config: any; // Complicated JSON object
  sidebarCollapsed: boolean;
  created?: string;
}

interface ChatState {
  chats: Chat[];
  activeChat: string;
  // User Chats
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chatId: string) => void;
  updateChat: (id: string, chat: Partial<Chat>) => void;
  deleteChat: (id: string) => void;
  getChatById: (id: string) => Chat | undefined;
}

const useChatStore = create<ChatState>((set, get) => ({
  // User Chats
  chats: [],
  activeChat: '',
  setChats: chats => set({ chats }),
  setActiveChat: (chatId: string) => set({ activeChat: chatId }),
  updateChat: (id, newChat) =>
    set(state => {
      console.log('Updating chat data:', id, newChat);
      const existingChatIndex = state.chats.findIndex(chat => chat.id === id);
      if (existingChatIndex > -1) {
        const updatedChats = state.chats.map(chat =>
          chat.id === id ? { ...chat, ...newChat } : chat
        );
        return { chats: updatedChats };
      } else {
        // If the chat doesn't exist, you might choose to create it or do other error handling
        console.error(`Chat with id ${id} not found.`);
        return { chats: state.chats };
      }
    }),
  deleteChat: id =>
    set(state => {
      return {
        chats: state.chats.filter(chat => chat.id !== id),
      };
    }),
  getChatById: id => {
    return get().chats.find(chat => chat.id === id);
  },
}));

export default useChatStore;
