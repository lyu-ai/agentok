import useSWR from 'swr';
import useFlowStore from '@/store/flow';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { fetcher } from './fetcher';

export function usePublicFlows() {
  const { data, error, mutate } = useSWR('/api/public-flows', fetcher);
  const setFlows = useFlowStore(state => state.setPublicFlows);
  const deleteFlow = useFlowStore(state => state.deletePublicFlow);

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
      const supabase = createClient();
      const session = await supabase.auth.getSession();
      await fetch(`/api/public-flows/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + session.data.session?.access_token,
        },
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

  return {
    flows: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    deleteFlow: handleDeleteFlow,
    isDeleting,
  };
}
