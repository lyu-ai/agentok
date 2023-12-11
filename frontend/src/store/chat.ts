import { create } from 'zustand';

export interface Chat {
  id: number;
  flowId: string; // Binded flow
  config: any; // Complicated JSON object
}

interface ChatState {
  chats: Chat[];
  // User Chats
  setChats: (chats: Chat[]) => void;
  updateChat: (id: string, chat: Chat) => void;
  deleteChat: (id: string) => void;
  getChatById: (id: string) => Chat | undefined;
}

const useChatStore = create<ChatState>((set, get) => ({
  // User Chats
  chats: [],
  setChats: chats => set({ chats }),
  updateChat: (id, newChat) =>
    set(state => {
      const numericId = Number(id);
      console.log('Updating chat with id:', numericId);
      const existingChatIndex = state.chats.findIndex(
        chat => chat.id === numericId
      );
      const newChats =
        existingChatIndex > -1
          ? state.chats.map(chat => (chat.id === numericId ? newChat : chat))
          : [...state.chats, newChat];
      return { chats: newChats };
    }),
  deleteChat: id =>
    set(state => {
      const numericId = Number(id);
      console.log('Deleting chat with id:', numericId);
      return {
        chats: isNaN(numericId)
          ? state.chats
          : state.chats.filter(chat => chat.id !== numericId),
      };
    }),
  getChatById: id => {
    const numericId = Number(id);
    return isNaN(numericId)
      ? undefined
      : get().chats.find(chat => chat.id === numericId);
  },
}));

export default useChatStore;
