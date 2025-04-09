// _store/ToolStore.ts
import { create } from "zustand";

interface OrderResponse {
  id: string;
  [key: string]: any;
  data: {
    category: string | null | undefined;
    targetUrl: string | null | undefined;
    toolsData: string | null | undefined;
    month: number | null | undefined;
    totalOrder: number | null | undefined;
  };
}

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

interface OrderState {
  tools: OrderResponse[];
  loading: boolean;
  error: string | null;
  getToolItems: () => Promise<void>;
  updateTools: (
    id: string,
    updatedData: Partial<OrderResponse["data"]>
  ) => Promise<void>;
}

export const useToolStore = create<OrderState>((set) => ({
  tools: [],
  loading: false,
  error: null,

  getToolItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/api/tools`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      const data = await response.json();
      set({ tools: data.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  updateTools: async (
    id: string,
    updatedData: Partial<OrderResponse["data"]>
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/api/tools/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: updatedData }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update tool: ${response.statusText}`);
      }

      // Update the tools array with the new data
      set((state) => ({
        tools: state.tools.map((tool) =>
          tool.id === id
            ? { ...tool, data: { ...tool.data, ...updatedData } }
            : tool
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
}));
