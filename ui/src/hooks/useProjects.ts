import useSWR from 'swr';
import useProjectStore, { Project } from '@/store/projects';
import { useState, useCallback, useEffect, useRef } from 'react';
import { fetcher } from './fetcher';
import supabase from '@/utils/supabase/client';
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
  const prevDataRef = useRef(data);
  useEffect(() => {
    if (data && !error && data !== prevDataRef.current) {
      setProjects(data);
      prevDataRef.current = data;
    }
  }, [data, error, setProjects, projects]);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    fetchUserId();
  }, []);

  const [isCreating, setIsCreating] = useState(false);
  const handleCreateProject = useCallback(
    async (project?: Project): Promise<Project | undefined> => {
      setIsCreating(true);
      try {
        const response = await fetch(`/api/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: project?.name ?? 'New Project',
            description:
              project?.description ?? 'A new project with sample nodes.',
            flow: project?.flow ?? {},
            user_id: userId,
          }),
        });
        if (!response.ok) throw new Error(await response.text());
        const newProject = await response.json();
        setProjects([newProject, ...projects]);
        mutate(); // Revalidate the SWR cache
        return newProject;
      } catch (error) {
        console.error('Failed to create project:', error);
      } finally {
        setIsCreating(false);
      }
    },
    [setProjects, mutate]
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteProject = useCallback(
    async (id: number) => {
      setIsDeleting(true);
      const previousProjects = [...data];
      deleteProject(id);
      try {
        await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        mutate(); // Revalidate the SWR cache
      } catch (error) {
        console.error('Failed to delete project:', error);
        setProjects(previousProjects);
      } finally {
        setIsDeleting(false);
      }
    },
    [data, deleteProject, setProjects, mutate]
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateProject = useCallback(
    async (id: number, project: Partial<Project>) => {
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
        mutate(); // Revalidate the SWR cache
      } catch (error) {
        console.error('Failed to update project:', error);
        updateProject(id, previousProject);
      } finally {
        setIsUpdating(false);
      }
    },
    [data, updateProject, mutate]
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
            user_id: userId,
          }),
        });
        if (!response.ok) throw new Error(response.statusText);
        const forkedProject = await response.json();
        setProjects([forkedProject, ...projects]);
        mutate(); // Revalidate the SWR cache
        return forkedProject;
      } catch (error) {
        console.error('Failed to fork project:', error);
      } finally {
        setIsForking(false);
      }
    },
    [setProjects, mutate]
  );

  return {
    projects: (data as Project[]) ?? [],
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

export function useProject(id: number) {
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
