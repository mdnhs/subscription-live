// _store/ToolStore.ts (assumed)
import { create } from "zustand";

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

interface Tool {
  documentId: string; // Use documentId instead of id
  category: string;
  month: number;
  totalOrder: number;
  [key: string]: any;
}

interface ToolState {
  tools: Tool[];
  loading: boolean;
  error: string | null;
  getToolItems: () => Promise<void>;
  updateTools: (documentId: string, data: Partial<Tool>) => Promise<void>;
}

export const useToolStore = create<ToolState>((set) => ({
  tools: [],
  loading: false,
  error: null,
  getToolItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/api/tools`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!response.ok) throw new Error("Failed to fetch tools");
      const data = await response.json();
      set({ tools: data.data, loading: false }); // Assuming Strapi returns { data: [...] }
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : String(error) });
    }
  },
  updateTools: async (documentId: string, data: Partial<Tool>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/api/tools/${documentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) throw new Error("Failed to update tool");
      const updatedTool = await response.json();
      set((state) => ({
        tools: state.tools.map((tool) =>
          tool.documentId === documentId ? updatedTool.data : tool
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : String(error) });
    }
  },
}));