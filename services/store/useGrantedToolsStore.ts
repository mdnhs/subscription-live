// useGrantedToolsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the interface for a granted tool
interface GrantedToolDetails {
  documentId?: string;
  name?: string;
  totalOrder?: number;
  price?: number;
  discountPercentage?: number;
  category?: string;
  duration?: number;
  isGranted?: boolean;
  userCount?: number;
}

// Define the state interface for the store
interface GrantedToolsState {
  grantedTools: GrantedToolDetails[];
  currentTool: GrantedToolDetails | null;
  loading: boolean;
  error: string | null;

  // Actions
  setGrantedTools: (tools: GrantedToolDetails[]) => void;
  addGrantedTool: (tool: GrantedToolDetails) => void;
  removeGrantedTool: (documentId: string) => void;
  updateGrantedTool: (
    documentId: string,
    updates: Partial<GrantedToolDetails>
  ) => void;
  setCurrentTool: (tool: GrantedToolDetails | null) => void;
  clearGrantedTools: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create the store with persistence
const useGrantedToolsStore = create<GrantedToolsState>()(
  persist(
    (set) => ({
      grantedTools: [],
      currentTool: null,
      loading: false,
      error: null,

      // Actions
      setGrantedTools: (tools) => set({ grantedTools: tools }),

      addGrantedTool: (tool) =>
        set((state) => {
          // Check if tool already exists to avoid duplicates
          const exists = state.grantedTools.some(
            (t) => t.documentId === tool.documentId
          );
          if (exists) {
            return state;
          }
          return { grantedTools: [...state.grantedTools, tool] };
        }),

      removeGrantedTool: (documentId) =>
        set((state) => ({
          grantedTools: state.grantedTools.filter(
            (tool) => tool.documentId !== documentId
          ),
        })),

      updateGrantedTool: (documentId, updates) =>
        set((state) => ({
          grantedTools: state.grantedTools.map((tool) =>
            tool.documentId === documentId ? { ...tool, ...updates } : tool
          ),
        })),

      setCurrentTool: (tool) => set({ currentTool: tool }),

      clearGrantedTools: () => set({ grantedTools: [], currentTool: null }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),
    }),
    {
      name: "granted-tools-storage", // Name of storage key
      partialize: (state) => ({
        grantedTools: state.grantedTools,
        currentTool: state.currentTool,
      }), // Only persist these fields
    }
  )
);

export default useGrantedToolsStore;
