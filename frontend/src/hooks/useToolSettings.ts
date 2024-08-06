import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { fetcher } from './fetcher';

export interface ToolSettings {
  [key: number]: { // Tool ID
    variables: {
      [key: string]: string; // Variable name and value
    };
  }
}

export function useToolSettings() {
  const { data, error, mutate } = useSWR<ToolSettings>('/api/settings/tools', fetcher);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateSettings = async (newSettings: ToolSettings) => {
    setIsUpdating(true);
    console.log('newSettings:', newSettings);
    try {
      const response = await fetch('/api/settings/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) throw new Error(await response.text());
      const updatedSettings = await response.json();
      await mutate(); // Revalidate the SWR cache
      return updatedSettings;
    } catch (error) {
      console.error('Failed to update the settings:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    settings: data ?? {},
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    updateSettings: handleUpdateSettings,
    isUpdating,
  };
}
