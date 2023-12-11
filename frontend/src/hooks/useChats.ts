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
      setChats(data);
    }
  }, [data, setChats]);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateChat = async (flowId: string) => {
    setIsCreating(true);
    try {
      const supabase = createClient();
      const session = await supabase.auth.getSession();
      const response = await fetch(`/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.data.session?.access_token,
        },
        body: JSON.stringify({
          flowId,
        }),
      });
      const newChat = await response.json();
      // If the post was successful, update the Zustand store
      setChats([newChat, ...chats]);
      return newChat;
    } catch (error) {
      console.error('Failed to create flow:', error);
      // Handle any errors, possibly using an error state from useState
    } finally {
      setIsCreating(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteChat = async (id: string) => {
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
      console.error('Failed to delete the chat:', error);
      // Rollback or handle the error state as necessary
      mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    chats: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    createChat: handleCreateChat,
    deleteChat: handleDeleteChat,
    isDeleting,
    isCreating,
  };
}
