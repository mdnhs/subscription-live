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
  };
}

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

interface OrderState {
  tools: OrderResponse[];
  loading: boolean;
  error: string | null;
  getToolItems: () => Promise<void>;
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
}));
