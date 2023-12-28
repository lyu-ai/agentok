import { create } from 'zustand';

export interface Chat {
  id: string;
  name: string;
  sourceId: string; // Binded flow
  sourceType: 'flow' | 'template';
  config: any; // Complicated JSON object
  created?: string;
}

interface ChatState {
  chats: Chat[];
  sidebarCollapsed: boolean;
  activeChat: string;
  // User Chats
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chatId: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  updateChat: (id: string, chat: Partial<Chat>) => void;
  deleteChat: (id: string) => void;
  getChatById: (id: string) => Chat | undefined;
}

const useChatStore = create<ChatState>((set, get) => ({
  // User Chats
  chats: [],
  sidebarCollapsed: false,
  activeChat: '',
  setChats: chats => set({ chats }),
  setActiveChat: (chatId: string) => set({ activeChat: chatId }),
  setSidebarCollapsed: (collapsed: boolean) =>
    set({ sidebarCollapsed: collapsed }),
  updateChat: (id, newChat) =>
    set(state => {
      const chats = state.chats.map(chat => {
        if (chat.id === id) {
          // Merge the existing flow with the new flow data, allowing for partial updates
          return { ...chat, ...newChat };
        }
        return chat;
      });
      return { chats };
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
