import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  openFlowIds: string[];
  activeFlowId: string;
  // User flows
  setFlows: (flows: Autoflow[]) => void;
  openFlow: (id: string) => void;
  closeFlow: (id: string) => void;
  updateFlow: (id: string, flow: Autoflow) => void;
  deleteFlow: (id: string) => void;
  getFlowById: (id: string) => Autoflow | undefined;
}

const useFlowStore = create<AutoflowState>()(
  persist(
    (set, get) => ({
      // User flows
      flows: [],
      openFlowIds: [],
      activeFlowId: '',
      setFlows: flows => set({ flows }),
      openFlow: (id: string) =>
        set(state => {
          if (state.openFlowIds.includes(id)) {
            if (state.activeFlowId !== id) {
              return { activeFlowId: id };
            }
            return {};
          }
          const openFlowIds = [id, ...state.openFlowIds];
          return { activeFlowId: id, openFlowIds };
        }),
      closeFlow: (id: string) =>
        set(state => {
          const openFlowIds = state.openFlowIds.filter(
            editingFlowId => editingFlowId !== id
          );
          if (state.activeFlowId === id) {
            set({ activeFlowId: '' });
          }
          return { openFlowIds };
        }),
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
            openFlowIds: state.openFlowIds.filter(
              openFlowId => openFlowId !== id
            ),
            activeFlowId: state.activeFlowId === id ? '' : state.activeFlowId,
          };
        }),
      getFlowById: id => {
        return get().flows.find(flow => flow.id === id);
      },
    }),
    {
      name: 'autoflow-store',
    }
  )
);

export default useFlowStore;
