import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: number;
  chat: string; // chat session id
  sender: string;
  receiver: string;
  content: string;
  type: string;
  created: string;
}

export interface Chat {
  id: number;
  name: string;
  sourceId: number; // Binded project or template
  sourceType: 'project' | 'template';
  config: any; // Complicated JSON object
  created?: string;
}

interface ChatState {
  chats: Chat[];
  sidebarCollapsed: boolean;
  activeChat: number;
  // User Chats
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chatId: number) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  updateChat: (id: number, chat: Partial<Chat>) => void;
  deleteChat: (id: number) => void;
  getChatById: (id: number) => Chat | undefined;
}

const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // User Chats
      chats: [],
      sidebarCollapsed: false,
      activeChat: -1,
      setChats: chats => set({ chats }),
      setActiveChat: (chatId: number) => set({ activeChat: chatId }),
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
    }),
    {
      name: 'agentok-chats',
    }
  )
);

export default useChatStore;
