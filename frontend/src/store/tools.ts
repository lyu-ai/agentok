import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToolSignature = {
  id: number;
  name: string;
  description: string;
  type: 'str' | 'int' | 'bool' | 'float';
};

export type ToolVariable = {
  id: number;
  name: string;
  description?: string;
  value?: string;
  default_value?: string;
};

export type Tool = {
  id: number;
  name: string;
  description: string;
  logo_url?: string;
  variables: ToolVariable[];
  code?: string;
  is_public: boolean;
  user_name?: string;
  user_avatar?: string;
  user_email?: string;
  created_at?: string;
  updated_at?: string;
};

interface ToolState {
  tools: Tool[];
  setTools: (tools: Tool[]) => void;
  updateTool: (id: number, tool: Partial<Tool>) => void;
  deleteTool: (id: number) => void;
  getToolById: (id: number) => Tool | undefined;
}

const useToolStore = create<ToolState>()(
  persist(
    (set, get) => ({
      tools: [],
      setTools: (tools) => set({ tools }),
      updateTool: (id, newTool) =>
        set((state) => {
          const tools = state.tools.map((tool) => {
            if (tool.id === id) {
              return { ...newTool, ...tool };
            }
            return tool;
          });
          return { tools };
        }),
      deleteTool: (id) =>
        set((state) => ({
          tools: state.tools.filter((t) => t.id !== id),
        })),
      getToolById: (id) =>
        id ? get().tools.find((tool) => tool.id === id) : undefined,
    }),
    {
      name: 'agentok-projects',
    }
  )
);

export default useToolStore;
