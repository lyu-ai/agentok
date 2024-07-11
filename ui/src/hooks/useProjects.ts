import useSWR from 'swr';
import useProjectStore, { Project } from '@/store/projects';
import { useEffect, useState, useCallback } from 'react';
import { fetcher } from './fetcher';
import pb from '@/utils/pocketbase/client';
import { isEqual } from 'lodash-es';
import { ProjectTemplate } from '@/store/templates';

export function useProjects() {
  const { data, error, mutate } = useSWR('/api/projects', fetcher, {
    revalidateOnFocus: false,
  });
  const projects = useProjectStore(state => state.projects);
  const setProjects = useProjectStore(state => state.setProjects);
  const deleteProject = useProjectStore(state => state.deleteProject);
  const updateProject = useProjectStore(state => state.updateProject);
  const getProjectById = useProjectStore(state => state.getProjectById);

  useEffect(() => {
    if (data && !isEqual(data, projects)) {
      setProjects(data);
    }
  }, [data, projects, setProjects]);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateProject = useCallback(async (): Promise<
    Project | undefined
  > => {
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
      if (!response.ok) throw new Error(await response.text());
      const newProject = await response.json();
      setProjects([newProject, ...projects]);
      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  }, [projects, setProjects]);

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteProject = useCallback(
    async (id: string) => {
      setIsDeleting(true);
      const previousProjects = [...projects];
      deleteProject(id);
      try {
        await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        mutate();
      } catch (error) {
        console.error('Failed to delete project:', error);
        setProjects(previousProjects);
      } finally {
        setIsDeleting(false);
      }
    },
    [projects, deleteProject, setProjects, mutate]
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateProject = useCallback(
    async (id: string, project: Partial<Project>) => {
      setIsUpdating(true);
      const previousProject = projects.find(p => p.id === id);
      if (!previousProject) return;

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
        const updatedProject = await response.json();
        updateProject(id, updatedProject);
      } catch (error) {
        console.error('Failed to update project:', error);
        updateProject(id, previousProject);
      } finally {
        setIsUpdating(false);
      }
    },
    [projects, updateProject]
  );

  const [isForking, setIsForking] = useState(false);
  const handleForkProject = useCallback(
    async (template: ProjectTemplate): Promise<Project | undefined> => {
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
        if (!response.ok) throw new Error(response.statusText);
        const forkedProject = await response.json();
        setProjects([forkedProject, ...projects]);
        return forkedProject;
      } catch (error) {
        console.error('Failed to fork project:', error);
      } finally {
        setIsForking(false);
      }
    },
    [projects, setProjects]
  );

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
    isError,
    updateProject: (project: Partial<Project>) => updateProject(id, project),
    isUpdating,
  };
}
