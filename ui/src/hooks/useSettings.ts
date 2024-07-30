import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { fetcher } from './fetcher';
import { useProject } from './useProjects';

export interface LlmModel {
  id: string;
  model: string;
  description: string;
  api_key: string;
  base_url?: string; // This is usually needed for OpenAI-compliant API providers such as Azure and Qwen
  api_version?: string;
  tags?: string;
}

export interface Settings {
  models?: LlmModel[];
  spyModeEnabled?: boolean;
}

export function useSettings() {
  const { data, error, mutate } = useSWR<Settings>('/api/settings', fetcher);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateSettings = async (newSettings: Settings) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/settings', {
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
    enableSpyMode: (enable: boolean) =>
      handleUpdateSettings({ spyModeEnabled: enable }),
    spyModeEnabled: data?.spyModeEnabled,
  };
}

export type ProjectSettings = {
  filters?: {
    [key: string]: string;
  };
  models?: LlmModel[];
};

export function useProjectSettings(projectId: number) {
  const { project, updateProject } = useProject(projectId);
  const { data, error, mutate } = useSWR(`/api/projects/${projectId}`, fetcher);
  const [isUpdating, setIsUpdating] = useState(false);
  const [settings, setSettings] = useState<ProjectSettings>();
  useEffect(() => {
    if (data) {
      setSettings(data.settings);
    }
  }, [data]);
  const handleUpdateSettings = async (newSettings: ProjectSettings) => {
    setIsUpdating(true);
    try {
      await updateProject({
        settings: { ...project?.settings, ...newSettings },
      });
    } catch (error) {
      console.error('Failed to update the settings:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    settings,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    updateSettings: handleUpdateSettings,
    isUpdating,
  };
}
