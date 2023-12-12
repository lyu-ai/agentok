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
      const numericId = Number(id);
      console.log('Updating flow with id:', numericId);
      const existingFlowIndex = state.flows.findIndex(
        flow => flow.id === numericId
      );
      const newFlows =
        existingFlowIndex > -1
          ? state.flows.map(flow => (flow.id === numericId ? newFlow : flow))
          : [...state.flows, newFlow];
      return { flows: newFlows };
    }),
  deleteFlow: id =>
    set(state => {
      const numericId = Number(id);
      console.log('Deleting flow with id:', numericId);
      return {
        flows: isNaN(numericId)
          ? state.flows
          : state.flows.filter(flow => flow.id !== numericId),
      };
    }),
  getFlowById: id => {
    const numericId = Number(id);
    return isNaN(numericId)
      ? undefined
      : get().flows.find(flow => flow.id === numericId);
  },
}));

export default useFlowStore;
