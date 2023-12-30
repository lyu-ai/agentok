import { create } from 'zustand';
import { Autoflow } from './flow';

export interface AutoflowTemplate {
  id?: string;
  name: string; // AutoflowTemplate name is probably different with the name of the included flow
  description: string;
  thumbnail?: string; // image url
  flow: Autoflow; // Complicated JSON object
  owner: string;
  created?: string;
}

interface AutoflowTemplateState {
  templates: AutoflowTemplate[];

  // Public flows (do not support update operation)
  setTemplates: (templates: AutoflowTemplate[]) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => AutoflowTemplate | undefined;
}

const useTemplateStore = create<AutoflowTemplateState>((set, get) => ({
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
}));

export default useTemplateStore;
