import useSWR from 'swr';
import useChatStore, { Chat } from '@/store/chats';
import { useEffect, useState } from 'react';
import { fetcher } from './fetcher';
import supabase from '@/utils/supabase/client';
import { isEqual } from 'lodash-es';
import useProjectStore from '@/store/projects';
import useTemplateStore from '@/store/templates';

export function useChats() {
  const { data, error, mutate } = useSWR('/api/chats', fetcher);
  const chats = useChatStore(state => state.chats);
  const setChats = useChatStore(state => state.setChats);
  const activeChat = useChatStore(state => state.activeChat);
  const setActiveChat = useChatStore(state => state.setActiveChat);
  const deleteChat = useChatStore(state => state.deleteChat);
  const sidebarCollapsed = useChatStore(state => state.sidebarCollapsed);
  const setSidebarCollapsed = useChatStore(state => state.setSidebarCollapsed);
  const projects = useProjectStore(state => state.projects);
  const templates = useTemplateStore(state => state.templates);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    fetchUserId();
  }, []);

  const getInitialName = (
    sourceId: number,
    sourceType: 'project' | 'template'
  ) => {
    const source =
      sourceType === 'project'
        ? projects.find(project => project.id === sourceId)
        : templates.find(template => template.id === sourceId);
    return `Chat for ${source?.name || ''}`;
  };

  useEffect(() => {
    if (data) {
      const normalizedChats = data.map((chatData: any) => {
        const { from_template, from_project, from_type, ...others } = chatData;
        if (from_type === 'project') {
          return {
            ...others,
            sourceId: from_project,
            sourceType: from_type,
          };
        } else {
          return {
            ...others,
            sourceId: from_template,
            sourceType: from_type,
          };
        }
      });
      if (!isEqual(normalizedChats, chats)) {
        setChats(normalizedChats);
      }
    }
  }, [data, chats, setChats]);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateChat = async (
    sourceId: number,
    sourceType: 'project' | 'template'
  ) => {
    setIsCreating(true);
    try {
      const body = {
        from_type: sourceType,
        name: getInitialName(sourceId, sourceType),
        user_id: userId,
        ...(sourceType === 'project'
          ? { from_project: sourceId }
          : { from_template: sourceId }),
      };
      const response = await fetch(`/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
      await fetch(`/api/chats/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      await mutate(); // Revalidate the cache to reflect the change
    } catch (error) {
      console.error('Failed to delete chat:', error);
      // Rollback or handle the error state as necessary
      mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  const updateChat = useChatStore(state => state.updateChat);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateChat = async (id: number, chat: Partial<Chat>) => {
    setIsUpdating(true);
    // Optimistically update the chat to the local state
    updateChat(id, chat);
    try {
      await fetch(`/api/chats/${id}`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ id, ...chat }),
      });
    } catch (error) {
      console.error('Failed to update chat:', error);
      // Rollback or handle the error state as necessary
      mutate();
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    chats,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    activeChat,
    setActiveChat,
    sidebarCollapsed,
    setSidebarCollapsed,
    createChat: handleCreateChat,
    isCreating,
    updateChat: handleUpdateChat,
    isUpdating,
    deleteChat: handleDeleteChat,
    isDeleting,
  };
}
