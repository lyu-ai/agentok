import { create } from 'zustand';

export interface Flow {
  id: number;
  name: string;
  flow: any; // Complicated JSON object
}

interface FlowState {
  flows: Flow[];
  setFlows: (flows: Flow[]) => void;
  deleteFlow: (id: string) => void;
  getFlowById: (id: string) => Flow | undefined;
}

const useFlowStore = create<FlowState>((set, get) => ({
  flows: [],
  setFlows: flows => set({ flows }),
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
