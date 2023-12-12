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
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => Template | undefined;
}

const useTemplateStore = create<TemplateState>((set, get) => ({
  // Public flows
  templates: [],
  setTemplates: templates => set({ templates }),
  deleteTemplate: id =>
    set(state => {
      const numericId = Number(id);
      console.log('Deleting template with id:', numericId);
      return {
        templates: isNaN(numericId)
          ? state.templates
          : state.templates.filter(flow => flow.id !== numericId),
      };
    }),
  getTemplateById: id => {
    const numericId = Number(id);
    return isNaN(numericId)
      ? undefined
      : get().templates.find(template => template.id === numericId);
  },
}));

export default useTemplateStore;
