import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from './projects';

export interface ProjectTemplate {
  id?: number;
  name: string;
  description: string;
  thumbnail?: string; // image url
  project: Project; // Complicated JSON object
  user_id?: string;
  created_at?: string;
}

interface ProjectTemplateState {
  templates: ProjectTemplate[];

  // Public flows (do not support update operation)
  setTemplates: (templates: ProjectTemplate[]) => void;
  deleteTemplate: (id: number) => void;
  getTemplateById: (id: number) => ProjectTemplate | undefined;
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
            templates: state.templates.filter(template => template.id !== id),
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
