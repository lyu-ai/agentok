import { create } from 'zustand';

export interface Flow {
  id: number;
  name: string;
  flow: any; // Complicated JSON object
}

interface FlowState {
  flows: Flow[];
  // User flows
  setFlows: (flows: Flow[]) => void;
  updateFlow: (id: number, flow: Flow) => void;
  deleteFlow: (id: number) => void;
  getFlowById: (id: number) => Flow | undefined;
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
        flows: isNaN(id)
          ? state.flows
          : state.flows.filter(flow => flow.id !== id),
      };
    }),
  getFlowById: id => {
    return isNaN(id) ? undefined : get().flows.find(flow => flow.id === id);
  },
}));

export default useFlowStore;
