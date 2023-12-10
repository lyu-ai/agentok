import useSWR from 'swr';
import useFlowStore, { Flow } from '@/store/flow';
import { useCallback, useEffect, useState } from 'react';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error fetching data');
  }
  return response.json();
};

export function useFlows() {
  const { data, error, mutate } = useSWR('/api/flows', fetcher);
  const setFlows = useFlowStore(state => state.setFlows);
  const deleteFlow = useFlowStore(state => state.deleteFlow);

  useEffect(() => {
    if (data) {
      setFlows(data);
    }
  }, [data, setFlows]);

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteFlow = async (id: string) => {
    setIsDeleting(true);
    // Optimistically remove the flow from the local state
    deleteFlow(id);
    try {
      await fetch(`/api/flows/${id}`, { method: 'DELETE' });
      mutate(); // Revalidate the cache to reflect the change
    } catch (error) {
      console.error('Failed to delete the flow:', error);
      // Rollback or handle the error state as necessary
      mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    flows: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    deleteFlow: handleDeleteFlow,
    isDeleting,
  };
}

export function useFlow(id: string) {
  const localFlow = useFlowStore(state => state.getFlowById(id));

  const { data, error } = useSWR<Flow>(
    localFlow ? null : `/api/flows/${id}`, // Don't fetch if the local flow exists
    fetcher // Ensure you have a 'fetcher' function that correctly fetches and returns a 'Flow' object
  );

  useEffect(() => {
    if (!localFlow && data) {
      // Access the current state using the 'set' method directly
      useFlowStore.setState(state => {
        // Determine if the flow already exists
        const existingFlowIndex = state.flows.findIndex(
          flow => flow.id === data.id
        );
        // If the flow exists, replace it. Otherwise, add the new flow.
        const newFlows =
          existingFlowIndex > -1
            ? state.flows.map(flow => (flow.id === data.id ? data : flow))
            : [...state.flows, data];

        // Update the state by calling setFlows with the new flows array
        return { flows: newFlows };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, id]);

  const [isSaving, setIsSaving] = useState(false);
  const saveFlow = useCallback(
    async (flowData: Flow) => {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/flows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(flowData),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const savedFlow = await response.json();

        // If the post was successful, update the Zustand store
        useFlowStore.setState(state => {
          const flowIndex = state.flows.findIndex(
            flow => flow.id === savedFlow.id
          );
          const updatedFlows =
            flowIndex > -1
              ? state.flows.map(flow =>
                  flow.id === savedFlow.id ? savedFlow : flow
                )
              : [...state.flows, savedFlow];

          return { flows: updatedFlows };
        });

        // Set loading to false if necessary
      } catch (error) {
        // Handle any errors, possibly using an error state from useState
        console.error('Failed to save flow:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [id, setIsSaving]
  );

  return {
    flow: localFlow ?? data,
    isLoading: !localFlow && !data && !error,
    isError: error,
    saveFlow,
    isSaving,
  };
}
