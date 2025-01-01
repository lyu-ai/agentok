import useSWR from 'swr';
import { fetcher } from './fetcher';
import { Tool } from '@/store/tools';
import { useCallback, useEffect, useRef, useState } from 'react';
import useToolStore from '@/store/tools';

export function usePublicTools() {
  const { data, error } = useSWR<Tool[]>('/api/tools/public', fetcher);

  return {
    tools: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useTools() {
  const { data, error, mutate } = useSWR<Tool[]>('/api/tools', fetcher);
  const tools = useToolStore((state) => state.tools);
  const updateTool = useToolStore((state) => state.updateTool);
  const deleteTool = useToolStore((state) => state.deleteTool);
  const setTools = useToolStore((state) => state.setTools);
  const prevDataRef = useRef(data);
  useEffect(() => {
    if (data && !error && data !== prevDataRef.current) {
      setTools(data);
      prevDataRef.current = data;
    }
  }, [data, error, setTools]);
  const [isCreating, setIsCreating] = useState(false);
  const handleCreateTool = useCallback(
    async (tool?: Partial<Tool>): Promise<Tool | undefined> => {
      setIsCreating(true);
      try {
        const response = await fetch(`/api/tools`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(tool),
        });
        if (!response.ok) throw new Error(await response.text());
        const newTool = await response.json();
        setTools([newTool, ...tools]);
        mutate(); // Revalidate the SWR cache
        return newTool;
      } catch (error) {
        console.error('Failed to create project:', error);
        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    [setTools, mutate]
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateTool = useCallback(
    async (id: number, tool: Partial<Tool>) => {
      setIsUpdating(true);
      const previousTool = tools.find((t) => t.id === id);
      if (!previousTool) return;
      updateTool(id, tool);
      try {
        const response = await fetch(`/api/tools/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(tool),
        });
        if (!response.ok) throw new Error(await response.text());
        const updatedTool = await response.json();
        updateTool(id, updatedTool);
        mutate(); // Revalidate the SWR cache
      } catch (error) {
        console.error('Failed to update project:', error);
        updateTool(id, previousTool);
      } finally {
        setIsUpdating(false);
      }
    },
    [data, updateTool, mutate]
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteTool = useCallback(
    async (id: number) => {
      setIsDeleting(true);
      const previousTools = [...tools];
      deleteTool(id);
      try {
        await fetch(`/api/tools/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        mutate(); // Revalidate the SWR cache
      } catch (error) {
        console.error('Failed to delete tool:', error);
        setTools(previousTools);
      } finally {
        setIsDeleting(false);
      }
    },
    [data, deleteTool, setTools, mutate]
  );

  const getToolById = useToolStore((state) => state.getToolById);

  return {
    tools: data ?? [],
    isLoading: !error && !data,
    isError: error,
    createTool: handleCreateTool,
    isCreating,
    updateTool: handleUpdateTool,
    isUpdating,
    deleteTool: handleDeleteTool,
    isDeleting,
    getToolById,
  };
}

export function useTool(toolId: number) {
  const { isLoading, isError, updateTool, deleteTool, getToolById } =
    useTools();

  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateTool = useCallback(
    async (tool: Partial<Tool>) => {
      setIsUpdating(true);
      await updateTool(toolId, tool).finally(() => {
        setIsUpdating(false);
      });
    },
    [updateTool, toolId]
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteTool = useCallback(async () => {
    setIsDeleting(true);
    await deleteTool(toolId).finally(() => {
      setIsDeleting(false);
    });
  }, [deleteTool, toolId]);

  return {
    tool: getToolById(toolId),
    isLoading,
    isError,
    updateTool: handleUpdateTool,
    isUpdating,
    deleteTool: handleDeleteTool,
    isDeleting,
  };
}
