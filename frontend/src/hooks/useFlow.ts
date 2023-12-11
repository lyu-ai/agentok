import useFlowStore, { Flow } from '@/store/flow';
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from './fetcher';
import { useFlows } from './useFlows';

export function useFlow(id: string) {
  const localFlow = useFlowStore(state => state.getFlowById(id));
  const { updateFlow, isUpdating } = useFlows();

  // Don't fetch if the local flow exists
  const { data, error } = useSWR<Flow>(
    localFlow ? null : `/api/flows/${id}`,
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

  return {
    flow: localFlow ?? data,
    isLoading: !localFlow && !data && !error,
    isError: error,
    updateFlow: (flow: Flow) => updateFlow(id, flow),
    isUpdating,
  };
}
