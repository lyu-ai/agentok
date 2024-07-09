import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from './projects';

export interface ProjectTemplate {
  id?: string;
  name: string;
  description: string;
  thumbnail?: string; // image url
  project: Project; // Complicated JSON object
  owner?: string;
  created?: string;
}

interface ProjectTemplateState {
  templates: ProjectTemplate[];

  // Public flows (do not support update operation)
  setTemplates: (templates: ProjectTemplate[]) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => ProjectTemplate | undefined;
}

const useTemplateStore = create<ProjectTemplateState>()(
  persist(
    (set, get) => ({
      // Public flows
      templates: [],
      setTemplates: templates => set({ templates }),
      deleteTemplate: id =>
        set(state => {
          return {
            templates: state.templates.filter(flow => flow.id !== id),
          };
        }),
      getTemplateById: id => {
        return get().templates.find(template => template.id === id);
      },
    }),
    {
      name: 'agentok-templates',
    }
  )
);

export default useTemplateStore;
