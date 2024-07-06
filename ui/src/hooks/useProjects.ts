import useSWR from 'swr';
import useProjectStore, { Project } from '@/store/projects';
import { ProjectTemplate } from '@/store/templates';
import { useEffect, useState } from 'react';
import { fetcher } from './fetcher';
import pb from '@/utils/pocketbase/client';
import { isEqual } from 'lodash-es';

export function useProjects() {
  const { data, error, mutate } = useSWR('/api/projects', fetcher);
  const projects = useProjectStore(state => state.projects);
  const setProjects = useProjectStore(state => state.setProjects);
  const deleteProject = useProjectStore(state => state.deleteProject);
  const updateProject = useProjectStore(state => state.updateProject);
  const getProjectById = useProjectStore(state => state.getProjectById);

  useEffect(() => {
    if (data && !isEqual(data, projects)) {
      setProjects(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateProject = async (): Promise<Project | undefined> => {
    setIsCreating(true);
    try {
      const response = await fetch(`/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: 'New Project',
          project: {},
          owner: pb.authStore.model?.id,
        }),
      });
      const newProject = await response.json();
      // If the post was successful, update the Zustand store
      setProjects([newProject, ...projects]);
      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      // Handle any errors, possibly using an error state from useState
    } finally {
      setIsCreating(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteProject = async (id: string) => {
    setIsDeleting(true);
    // Optimistically remove the project from the local state
    deleteProject(id);
    try {
      await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      mutate(); // Revalidate the cache to reflect the change
    } catch (error) {
      console.error('Failed to delete the project:', error);
      // Rollback or handle the error state as necessary
      mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateProject = async (id: string, project: Partial<Project>) => {
    setIsUpdating(true);
    const currentProjectState = projects.find(f => f.id === id);
    // Optimistically update the project in the local state
    updateProject(id, project);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error('Failed to update the project:', error);
      // Rollback local state changes
      if (currentProjectState) {
        updateProject(id, currentProjectState);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const [isForking, setIsForking] = useState(false);
  const handleForkProject = async (
    template: ProjectTemplate
  ): Promise<Project | undefined> => {
    setIsForking(true);
    try {
      const response = await fetch(`/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          project: template.project,
          owner: pb.authStore.model?.id,
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const forkedProject = await response.json();
      // If the post was successful, update the Zustand store
      setProjects([forkedProject, ...projects]);
      return forkedProject;
    } catch (error) {
      console.error('Failed to fork the project:', error);
      // Handle any errors, possibly using an error state from useState
    } finally {
      setIsForking(false);
    }
    return undefined;
  };

  return {
    projects,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
    forkProject: handleForkProject,
    getProjectById,
    isCreating,
    isDeleting,
    isForking,
    isUpdating,
  };
}

export function useProject(id: string) {
  const {
    isLoading,
    isError,
    updateProject,
    isUpdating,
    getProjectById,
  } = useProjects();
  return {
    project: getProjectById(id),
    isLoading,
    isError: isError,
    updateProject: (project: Partial<Project>) => updateProject(id, project),
    isUpdating,
  };
}
