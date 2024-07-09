import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { fetcher } from './fetcher';
import { useProject } from './useProjects';

export interface LlmModel {
  id: string;
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
  const [settings, setSettings] = useState<Settings>({ models: [] });
  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data]);
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
      setSettings(updatedSettings);
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
    settings,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    updateSettings: handleUpdateSettings,
    isUpdating,
  };
}

export type ProjectSettings = {
  filters?: {
    [key: string]: string;
  };
  models?: LlmModel[];
};

export function useProjectSettings(projectId: string) {
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
