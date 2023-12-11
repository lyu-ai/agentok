import { create } from 'zustand';

export interface Flow {
  id: number;
  name: string;
  flow: any; // Complicated JSON object
}

export interface PublicFlow {
  id: number;
  name: string;
  description: string;
  flow: any; // Complicated JSON object
  owner: string;
  tags: string;
}

interface FlowState {
  flows: Flow[];
  publicFlows: PublicFlow[];
  // User flows
  setFlows: (flows: Flow[]) => void;
  updateFlow: (id: string, flow: Flow) => void;
  deleteFlow: (id: string) => void;
  getFlowById: (id: string) => Flow | undefined;
  // Public flows (do not support update operation)
  setPublicFlows: (flows: PublicFlow[]) => void;
  deletePublicFlow: (id: string) => void;
  getPublicFlowById: (id: string) => PublicFlow | undefined;
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
  // Public flows
  publicFlows: [],
  setPublicFlows: publicFlows => set({ publicFlows }),
  deletePublicFlow: id =>
    set(state => {
      const numericId = Number(id);
      console.log('Deleting public flow with id:', numericId);
      return {
        flows: isNaN(numericId)
          ? state.publicFlows
          : state.publicFlows.filter(flow => flow.id !== numericId),
      };
    }),
  getPublicFlowById: id => {
    const numericId = Number(id);
    return isNaN(numericId)
      ? undefined
      : get().publicFlows.find(flow => flow.id === numericId);
  },
}));

export default useFlowStore;
