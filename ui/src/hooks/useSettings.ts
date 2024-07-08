import useSWR from 'swr';
import { useState } from 'react';
import { fetcher } from './fetcher';

export interface LlmModel {
  name: string;
  description: string;
  apiKey: string;
  baseUrl?: string; // This is usually needed for OpenAI-compliant API providers such as Azure and Qwen
  apiVersion?: string;
}

export interface Settings {
  models?: LlmModel[];
}

export function useSettings() {
  const { data, error, mutate } = useSWR('/api/settings', fetcher);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateSettings = async (settings: Settings) => {
    setIsUpdating(true);
    // Optimistically update the project in the local state
    try {
      const response = await fetch(`/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error('Failed to update the project:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    settings: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    updateSettings: handleUpdateSettings,
    isUpdating,
  };
}
