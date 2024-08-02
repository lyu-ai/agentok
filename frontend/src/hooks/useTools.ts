import useSWR from 'swr';
import { fetcher } from './fetcher';
import { Tool } from '@/store/projects';

export type SharedTool = {
  id: string;
  name: string;
  icon: string;
  description: string;
  tool: Tool; // tool id
  user_id: string;
};

export function useSharedTools() {
  const { data, error } = useSWR<SharedTool[]>('/api/tools', fetcher);

  // TODO: Add publish and delete functions

  return {
    tools: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}
