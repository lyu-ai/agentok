import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: number;
  name: string;
  description?: string;
  flow: any; // Complicated JSON object
  settings?: any;
  created_at?: string;
  updated_at?: string;
}

interface ProjectState {
  projects: Project[];
  activeProjectId: number;
  nodePanePinned: boolean;
  chatPanePinned: boolean;
  hoveredGroupId: string | null;
  setProjects: (projects: Project[]) => void;
  setActiveProjectId: (id: number) => void;
  pinNodePane: (pinned: boolean) => void;
  pinChatPane: (pinned: boolean) => void;
  setHoveredGroupId: (id: string | null) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  getProjectById: (id: number) => Project | undefined;
}

const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: -1,
      nodePanePinned: false,
      chatPanePinned: false,
      hoveredGroupId: null,
      setProjects: (projects) => set({ projects }),
      setActiveProjectId: (id) => set({ activeProjectId: id }),
      pinNodePane: (pinned) => set({ nodePanePinned: pinned }),
      pinChatPane: (pinned) => set({ chatPanePinned: pinned }),
      setHoveredGroupId: (id) => set({ hoveredGroupId: id }),
      updateProject: (id, newProject) =>
        set((state) => {
          const projects = state.projects.map((project) => {
            if (project.id === id) {
              // Merge the existing Project with the new Project data, allowing for partial updates
              return { ...project, ...newProject };
            }
            return project;
          });
          return { projects };
        }),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),
      getProjectById: (id) =>
        id ? get().projects.find((project) => project.id === id) : undefined,
    }),
    {
      name: 'agentok-projects',
    }
  )
);

export default useProjectStore;
