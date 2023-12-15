import { create } from 'zustand';

export interface Flow {
  id: string;
  name: string;
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
      console.log('Updating flow with id:', id);
      const existingFlowIndex = state.flows.findIndex(flow => flow.id === id);
      const newFlows =
        existingFlowIndex > -1
          ? state.flows.map(flow => (flow.id === id ? newFlow : flow))
          : [...state.flows, newFlow];
      return { flows: newFlows };
    }),
  deleteFlow: id =>
    set(state => {
      console.log('Deleting flow with id:', id);
      return {
        flows: state.flows.filter(flow => flow.id !== id),
      };
    }),
  getFlowById: id => {
    return get().flows.find(flow => flow.id === id);
  },
}));

export default useFlowStore;
