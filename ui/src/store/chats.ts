import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: number;
  chat_id: number; // chat session id
  sender: string;
  receiver: string;
  content: string;
  type: string;
  created_at: string;
}

export interface Chat {
  id: number;
  name: string;
  from_project: number; // Binded project
  from_template: number; // Binded template
  from_type: 'project' | 'template';
  config: any; // Complicated JSON object
  status: string;
  created_at?: string;
}

interface ChatState {
  chats: Chat[];
  sidebarCollapsed: boolean;
  activeChatId: number;
  // User Chats
  setChats: (chats: Chat[]) => void;
  setActiveChatId: (chatId: number) => void;
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
      activeChatId: -1,
      setChats: chats => set({ chats }),
      setActiveChatId: (chatId: number) => set({ activeChatId: chatId }),
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
