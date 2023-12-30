import { create } from 'zustand';

export interface Autoflow {
  id: string;
  name?: string;
  description?: string;
  flow: any; // Complicated JSON object
  created?: string;
  updated?: string;
}

interface AutoflowState {
  flows: Autoflow[];
  // User flows
  setFlows: (flows: Autoflow[]) => void;
  updateFlow: (id: string, flow: Autoflow) => void;
  deleteFlow: (id: string) => void;
  getFlowById: (id: string) => Autoflow | undefined;
}

const useFlowStore = create<AutoflowState>((set, get) => ({
  // User flows
  flows: [],
  setFlows: flows => set({ flows }),
  updateFlow: (id, newFlow) =>
    set(state => {
      const flows = state.flows.map(flow => {
        if (flow.id === id) {
          // Merge the existing flow with the new flow data, allowing for partial updates
          return { ...flow, ...newFlow };
        }
        return flow;
      });
      return { flows };
    }),
  deleteFlow: id =>
    set(state => {
      return {
        flows: state.flows.filter(flow => flow.id !== id),
      };
    }),
  getFlowById: id => {
    return get().flows.find(flow => flow.id === id);
  },
}));

export default useFlowStore;
