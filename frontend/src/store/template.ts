import { create } from 'zustand';
import { Flow } from './flow';

export interface Template {
  id: number;
  name: string; // Template name is probably different with the name of the included flow
  description: string;
  thumbnail?: string; // image url
  flow: Flow; // Complicated JSON object
  owner: string;
}

interface TemplateState {
  templates: Template[];

  // Public flows (do not support update operation)
  setTemplates: (templates: Template[]) => void;
  deleteTemplate: (id: number) => void;
  getTemplateById: (id: number) => Template | undefined;
}

const useTemplateStore = create<TemplateState>((set, get) => ({
  // Public flows
  templates: [],
  setTemplates: templates => set({ templates }),
  deleteTemplate: id =>
    set(state => {
      console.log('Deleting template with id:', id);
      return {
        templates: isNaN(id)
          ? state.templates
          : state.templates.filter(flow => flow.id !== id),
      };
    }),
  getTemplateById: id => {
    return isNaN(id)
      ? undefined
      : get().templates.find(template => template.id === id);
  },
}));

export default useTemplateStore;
