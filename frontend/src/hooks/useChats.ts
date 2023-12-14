import useSWR from 'swr';
import useChatStore from '@/store/chat';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { fetcher } from './fetcher';

export function useChats() {
  const { data, error, mutate } = useSWR('/api/chats', fetcher);
  const chats = useChatStore(state => state.chats);
  const setChats = useChatStore(state => state.setChats);
  const deleteChat = useChatStore(state => state.deleteChat);

  useEffect(() => {
    if (data) {
      const normalizedChats = data.map((chatData: any) => {
        const { template_id, flow_id, source_type, ...others } = chatData;
        if (source_type === 'flow') {
          return {
            ...others,
            sourceId: flow_id,
            sourceType: source_type,
          };
        } else {
          return {
            ...others,
            sourceId: template_id,
            sourceType: source_type,
          };
        }
      });
      setChats(normalizedChats);
    }
  }, [data, setChats]);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateChat = async (
    sourceId: string,
    sourceType: 'flow' | 'template'
  ) => {
    setIsCreating(true);
    try {
      const supabase = createClient();
      const session = await supabase.auth.getSession();
      if (!session.data.session?.access_token) {
        throw new Error('No valid session found');
      }
      const body = {
        source_type: sourceType,
        ...(sourceType === 'flow'
          ? { flow_id: sourceId }
          : { template_id: sourceId }),
      };
      const response = await fetch(`/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.data.session?.access_token,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || response.statusText);
      }
      const newChat = await response.json();
      // If the post was successful, update the Zustand store
      setChats([newChat, ...chats]);
      return newChat;
    } catch (error) {
      console.error(`Failed to create chat: ${error}`);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteChat = async (id: number) => {
    setIsDeleting(true);
    // Optimistically remove the flow from the local state
    deleteChat(id);
    try {
      const supabase = createClient();
      const session = await supabase.auth.getSession();
      await fetch(`/api/chats/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + session.data.session?.access_token,
        },
      });
      mutate(); // Revalidate the cache to reflect the change
    } catch (error) {
      console.error('Failed to delete chat:', error);
      // Rollback or handle the error state as necessary
      mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  const updateChat = useChatStore(state => state.updateChat);

  return {
    chats,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    createChat: handleCreateChat,
    updateChat,
    deleteChat: handleDeleteChat,
    isDeleting,
    isCreating,
  };
}

export function useChat(chatId: number) {
  const { chats, updateChat, isLoading, isError } = useChats();
  const chat = chats.find(chat => chat.id === chatId);
  const collapseSidebar = (collpased: boolean) => {
    updateChat(chatId, { sidebarCollapsed: collpased });
  };
  return {
    collapseSidebar,
    chat,
    isLoading,
    isError,
  };
}
