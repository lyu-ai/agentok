import useSWR from 'swr';
import useFlowStore, { Autoflow } from '@/store/flow';
import { AutoflowTemplate } from '@/store/template';
import { useEffect, useState } from 'react';
import {
  getFlowDescription,
  getFlowName,
  initialEdges,
  initialNodes,
} from '@/app/[locale]/utils/flow';
import { fetcher } from './fetcher';
import pb from '@/utils/pocketbase/client';
import { isEqual } from 'lodash-es';

export function useFlows() {
  const { data, error, mutate } = useSWR('/api/flows', fetcher);
  const flows = useFlowStore(state => state.flows);
  const setFlows = useFlowStore(state => state.setFlows);
  const deleteFlow = useFlowStore(state => state.deleteFlow);
  const updateFlow = useFlowStore(state => state.updateFlow);
  const getFlowById = useFlowStore(state => state.getFlowById);

  useEffect(() => {
    if (data && !isEqual(data, flows)) {
      setFlows(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateFlow = async (): Promise<Autoflow | undefined> => {
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
  const handleUpdateFlow = async (id: string, flow: Autoflow) => {
    setIsUpdating(true);
    const flowToUpdate = {
      name: getFlowName(flow.flow?.nodes),
      description: getFlowDescription(flow.flow?.nodes),
      ...flow,
    };
    const currentFlowState = flows.find(f => f.id === id);
    // Optimistically update the flow in the local state
    updateFlow(id, flowToUpdate);
    try {
      const response = await fetch(`/api/flows/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(flowToUpdate),
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error('Failed to update the flow:', error);
      // Rollback local state changes
      if (currentFlowState) {
        updateFlow(id, currentFlowState);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const [isForking, setIsForking] = useState(false);
  const handleForkFlow = async (
    template: AutoflowTemplate
  ): Promise<Autoflow | undefined> => {
    setIsForking(true);
    try {
      const response = await fetch(`/api/flows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          flow: template.flow,
          owner: pb.authStore.model?.id,
        }),
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
    flows,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    createFlow: handleCreateFlow,
    updateFlow: handleUpdateFlow,
    deleteFlow: handleDeleteFlow,
    forkFlow: handleForkFlow,
    getFlowById,
    isCreating,
    isDeleting,
    isForking,
    isUpdating,
  };
}

export function useFlow(id: string) {
  const {
    isLoading,
    isError,
    updateFlow,
    isUpdating,
    getFlowById,
  } = useFlows();
  return {
    flow: getFlowById(id),
    isLoading,
    isError: isError,
    updateFlow: (flow: Autoflow) => updateFlow(id, flow),
    isUpdating,
  };
}
