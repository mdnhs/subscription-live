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
  cachedTools: OrderResponse[]; // Cache for all tools
  cachedToolById: { [id: string]: OrderResponse }; // Cache for individual tools
  isFetching: { [key: string]: boolean }; // Lock to prevent concurrent fetches
  getToolItems: () => Promise<void>;
  updateTools: (id: string, updatedData: Partial<OrderResponse["data"]>) => Promise<void>;
  clearCache: () => void; // Optional: for manual cache invalidation
}

export const useToolStore = create<OrderState>((set, get) => ({
  tools: [],
  loading: false,
  error: null,
  cachedTools: [], // Cache for getToolItems
  cachedToolById: {}, // Cache for individual tools by ID
  isFetching: {}, // e.g., { "getTools": false, "updateTool_123": false }

  getToolItems: async () => {
    const cacheKey = "getTools";
    const state = get();

    // Check cache first
    if (state.cachedTools.length > 0) {
      set({ tools: state.cachedTools, loading: false, error: null });
      return;
    }

    // Check if already fetching
    if (state.isFetching[cacheKey]) return;

    set({ loading: true, error: null, isFetching: { ...state.isFetching, [cacheKey]: true } });
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
      const tools = data.data as OrderResponse[];
      set({
        tools,
        cachedTools: tools,
        loading: false,
        error: null,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({
        loading: false,
        error: errorMessage,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    }
  },

  updateTools: async (id: string, updatedData: Partial<OrderResponse["data"]>) => {
    const cacheKey = `updateTool_${id}`;
    const state = get();

    // Check if already fetching
    if (state.isFetching[cacheKey]) return;

    set({ loading: true, error: null, isFetching: { ...state.isFetching, [cacheKey]: true } });
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

      const updatedTool = await response.json();
      const updatedToolData = updatedTool.data as OrderResponse;

      // Update both tools array and caches
      const updatedTools = state.tools.map((tool) =>
        tool.id === id ? updatedToolData : tool
      );
      set({
        tools: updatedTools,
        cachedTools: updatedTools,
        cachedToolById: { ...state.cachedToolById, [id]: updatedToolData },
        loading: false,
        error: null,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({
        loading: false,
        error: errorMessage,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    }
  },

  clearCache: () => set({ cachedTools: [], cachedToolById: {} }), // Optional: for manual cache invalidation
}));