import { create } from 'zustand';

export interface Flow {
  id: string;
  name?: string;
  description?: string;
  flow: any; // Complicated JSON object
  created?: string;
  updated?: string;
}

interface FlowState {
  flows: Flow[];
  // User flows
  setFlows: (flows: Flow[]) => void;
  updateFlow: (id: string, flow: Flow) => void;
  deleteFlow: (id: string) => void;
  getFlowById: (id: string) => Flow | undefined;
}

const useFlowStore = create<FlowState>((set, get) => ({
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
