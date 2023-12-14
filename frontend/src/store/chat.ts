import { create } from 'zustand';

export interface Chat {
  id: number;
  name: string;
  sourceId: string; // Binded flow
  sourceType: 'flow' | 'template';
  config: any; // Complicated JSON object
  sidebarCollapsed: boolean;
}

interface ChatState {
  chats: Chat[];
  activeChat: number;
  // User Chats
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chatId: number) => void;
  updateChat: (id: number, chat: Partial<Chat>) => void;
  deleteChat: (id: number) => void;
  getChatById: (id: number) => Chat | undefined;
}

const useChatStore = create<ChatState>((set, get) => ({
  // User Chats
  chats: [],
  activeChat: -1,
  setChats: chats => set({ chats }),
  setActiveChat: (chatId: number) => set({ activeChat: chatId }),
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
        chats: isNaN(id)
          ? state.chats
          : state.chats.filter(chat => chat.id !== id),
      };
    }),
  getChatById: id => {
    return isNaN(id) ? undefined : get().chats.find(chat => chat.id === id);
  },
}));

export default useChatStore;
