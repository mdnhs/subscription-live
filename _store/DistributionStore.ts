// _store/ToolStore.ts
import { create } from "zustand";

interface DistributionResponse {
  id: string;
  [key: string]: any;
  data: {
    toolName: string | null | undefined;
    numberOfUser: number | null | undefined;
  };
}

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

interface OrderState {
  distributions: DistributionResponse[];
  loading: boolean;
  error: string | null;
  getDistributionItems: () => Promise<void>;
}

export const useDistributionStore = create<OrderState>((set) => ({
  distributions: [],
  loading: false,
  error: null,
  getDistributionItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/api/distributions`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      const data = await response.json();
      set({ distributions: data.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
}));
