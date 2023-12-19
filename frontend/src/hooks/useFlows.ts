import useSWR from 'swr';
import useFlowStore, { Flow } from '@/store/flow';
import { Template } from '@/store/template';
import { useEffect, useState } from 'react';
import {
  getFlowName,
  initialEdges,
  initialNodes,
} from '@/app/[locale]/utils/flow';
import { fetcher } from './fetcher';
import pb from '@/utils/pocketbase/client';

export function useFlows() {
  const { data, error, mutate } = useSWR('/api/flows', fetcher);
  const flows = useFlowStore(state => state.flows);
  const setFlows = useFlowStore(state => state.setFlows);
  const deleteFlow = useFlowStore(state => state.deleteFlow);
  const updateFlow = useFlowStore(state => state.updateFlow);

  useEffect(() => {
    if (data) {
      setFlows(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateFlow = async (): Promise<Flow | undefined> => {
    console.log('useFlows.createFlow');
    setIsCreating(true);
    try {
      const response = await fetch(`/api/flows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: getFlowName(initialNodes),
          flow: {
            nodes: initialNodes,
            edges: initialEdges,
          },
          owner: pb.authStore.model?.id,
        }),
      });
      const newFlow = await response.json();
      // If the post was successful, update the Zustand store
      setFlows([newFlow, ...flows]);
      return newFlow;
    } catch (error) {
      console.error('Failed to create flow:', error);
      // Handle any errors, possibly using an error state from useState
    } finally {
      setIsCreating(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteFlow = async (id: string) => {
    setIsDeleting(true);
    // Optimistically remove the flow from the local state
    deleteFlow(id);
    try {
      await fetch(`/api/flows/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      mutate(); // Revalidate the cache to reflect the change
    } catch (error) {
      console.error('Failed to delete the flow:', error);
      // Rollback or handle the error state as necessary
      mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateFlow = async (id: string, flow: Flow) => {
    setIsUpdating(true);
    // Optimistically update the flow in the local state
    updateFlow(id, flow);
    try {
      const response = await fetch(`/api/flows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(flow),
      });
      const updatedFlow = await response.json();
      updateFlow(id, updatedFlow);
      mutate(); // Optional: if the PUT API call returns the updated list
      return updatedFlow;
    } catch (error) {
      console.error('Failed to update the flow:', error);
      // Handle the error state as necessary
      mutate();
    } finally {
      setIsUpdating(false);
    }
  };

  const [isForking, setIsForking] = useState(false);
  const handleForkFlow = async (
    template: Template
  ): Promise<Flow | undefined> => {
    setIsForking(true);
    try {
      const { id, description, ...newFlow } = template;
      const response = await fetch(`/api/flows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newFlow),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const forkedFlow = await response.json();
      // If the post was successful, update the Zustand store
      setFlows([forkedFlow, ...flows]);
      return forkedFlow;
    } catch (error) {
      console.error('Failed to fork the flow:', error);
      // Handle any errors, possibly using an error state from useState
    } finally {
      setIsForking(false);
    }
    return undefined;
  };

  return {
    flows: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    createFlow: handleCreateFlow,
    updateFlow: handleUpdateFlow,
    deleteFlow: handleDeleteFlow,
    forkFlow: handleForkFlow,
    isCreating,
    isDeleting,
    isForking,
    isUpdating,
  };
}
