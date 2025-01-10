import useSWR from 'swr';
import useChatStore, { Chat } from '@/store/chats';
import { useEffect, useState } from 'react';
import { fetcher } from './fetcher';
import { isEqual } from 'lodash-es';
import useProjectStore from '@/store/projects';
import useTemplateStore from '@/store/templates';
import { useProjects } from './use-projects';
import { useTemplates } from './use-templates';
import { createClient } from '@/lib/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { genId } from '@/lib/id';

export function useChats() {
  const { data, error, mutate } = useSWR('/api/chats', fetcher);
  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const sidebarCollapsed = useChatStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useChatStore((state) => state.setSidebarCollapsed);
  const projects = useProjectStore((state) => state.projects);
  const templates = useTemplateStore((state) => state.templates);

  const getInitialName = (
    sourceId: number,
    sourceType: 'project' | 'template'
  ) => {
    const source =
      sourceType === 'project'
        ? projects.find((project) => project.id === sourceId)
        : templates.find((template) => template.id === sourceId);
    return `Chat for ${source?.name || ''}`;
  };

  useEffect(() => {
    if (data && !isEqual(data, chats)) {
      setChats(data);
    }
  }, [data, chats, setChats]);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateChat = async (
    sourceId: number,
    sourceType: 'project' | 'template'
  ) => {
    setIsCreating(true);

    try {
      const response = await fetch(`/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          from_type: sourceType,
          name: getInitialName(sourceId, sourceType),
          ...(sourceType === 'project'
            ? { from_project: sourceId }
            : { from_template: sourceId }),
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text() || response.statusText);
      }

      const newChat = await response.json();
      await mutate((currentData: Chat[]) => {
        const updatedData = [newChat, ...(currentData || [])];
        setChats(updatedData);
        return updatedData;
      }, false);

      return newChat;
    } catch (error) {
      console.error(`Failed to create chat: ${error}`);
      // Revert optimistic update on error
      await mutate();
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteChat = async (id: number) => {
    setIsDeleting(true);
    try {
      // Optimistically remove from local state
      const previousChats = [...chats];
      deleteChat(id);

      const response = await fetch(`/api/chats/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(await response.text() || response.statusText);
      }

      // Update SWR cache after successful deletion
      await mutate((currentData: Chat[]) => {
        const updatedData = currentData?.filter((chat) => chat.id !== id) || [];
        setChats(updatedData);
        return updatedData;
      }, false);
    } catch (error) {
      console.error('Failed to delete chat:', error);
      // Revert optimistic update on error
      await mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  const updateChat = useChatStore((state) => state.updateChat);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateChat = async (id: number, chatUpdate: Partial<Chat>) => {
    setIsUpdating(true);
    try {
      // Optimistically update local state
      updateChat(id, chatUpdate);

      const response = await fetch(`/api/chats/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...chatUpdate }),
      });

      if (!response.ok) {
        throw new Error(await response.text() || response.statusText);
      }

      const updatedChat = await response.json();
      
      // Update SWR cache after successful update
      await mutate((currentData: Chat[]) => {
        const updatedData = currentData?.map((chat) =>
          chat.id === id ? { ...chat, ...updatedChat } : chat
        ) || [];
        setChats(updatedData);
        return updatedData;
      }, false);
    } catch (error) {
      console.error('Failed to update chat:', error);
      // Revert optimistic update on error
      await mutate();
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    chats,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    activeChatId,
    setActiveChatId,
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

export function useChat(chatId: number) {
  const { chats, updateChat, isUpdating, isLoading, isError } = useChats();
  const { projects } = useProjects();
  const { templates } = useTemplates();

  const chat =
    chatId === -1 ? undefined : chats.find((chat) => chat.id === chatId);
  const chatSource =
    chatId === -1
      ? undefined
      : chat?.from_type === 'project'
        ? projects &&
          projects.find((project: any) => project.id === chat.from_project)
        : templates &&
          templates.find((template: any) => template.id === chat?.from_template)
            ?.project;

  useEffect(() => {
    if (chatId === -1) return;

    // Subscribe to chat status updates
    const supabase = createClient();
    const channel = supabase
      .channel(`chat_status_${genId()}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chats',
          filter: `id=eq.${chatId}`,
        },
        (payload: RealtimePostgresChangesPayload<{ status: string }>) => {
          console.log('changes_event(chats):', payload);
          if (payload.new && 'status' in payload.new) {
            updateChat(chatId, { status: payload.new.status });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, updateChat]);

  const handleUpdateChat = (chat: Partial<Chat>) => {
    updateChat(chatId, chat);
  };

  return {
    chat,
    chatSource,
    updateChat: handleUpdateChat,
    isUpdating,
    isLoading,
    isError,
  };
}
