import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  description?: string;
  flow: any; // Complicated JSON object
  tools?: any;
  knowledge?: any;
  settings?: any;
  created?: string;
  updated?: string;
}

interface ProjectState {
  projects: Project[];
  chatPanePinned: boolean;
  nodePanePinned: boolean;
  // User Projects
  setProjects: (Projects: Project[]) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  pinChatPane: (pin: boolean) => void; // pin/unpin chat pane
  pinNodePane: (pin: boolean) => void;
}

const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      chatPanePinned: false,
      nodePanePinned: false,
      setProjects: projects => set({ projects }),
      updateProject: (id, newProject) =>
        set(state => {
          const projects = state.projects.map(project => {
            if (project.id === id) {
              // Merge the existing Project with the new Project data, allowing for partial updates
              return { ...project, ...newProject };
            }
            return project;
          });
          return { projects };
        }),
      deleteProject: id =>
        set(state => {
          return {
            projects: state.projects.filter(project => project.id !== id),
          };
        }),
      getProjectById: id => {
        return get().projects.find(project => project.id === id);
      },
      pinChatPane: (pin: boolean) => set({ chatPanePinned: pin }),
      pinNodePane: (pin: boolean) => set({ nodePanePinned: pin }),
    }),
    {
      name: 'agentok-projects',
    }
  )
);

export default useProjectStore;
