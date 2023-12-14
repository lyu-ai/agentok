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
  // User Chats
  setChats: (chats: Chat[]) => void;
  updateChat: (id: number, chat: Partial<Chat>) => void;
  deleteChat: (id: number) => void;
  getChatById: (id: number) => Chat | undefined;
}

const useChatStore = create<ChatState>((set, get) => ({
  // User Chats
  chats: [],
  setChats: chats => set({ chats }),
  updateChat: (id, newChat) =>
    set(state => {
      console.log('Updating chat data:', id, newChat);
      const existingChatIndex = state.chats.findIndex(chat => chat.id === id);
      if (existingChatIndex > -1) {
        const updatedChats = state.chats.map(chat =>
          chat.id === id ? { ...chat, ...newChat } : chat
        );
        console.log('>>> New chat data:', updatedChats);
        return { chats: updatedChats };
      } else {
        // If the chat doesn't exist, you might choose to create it or do other error handling
        console.error(`Chat with id ${id} not found.`);
        return { chats: state.chats };
      }
    }),
  deleteChat: id =>
    set(state => {
      console.log('Deleting chat with id:', id);
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
