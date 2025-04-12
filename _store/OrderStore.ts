// _store/OrderStore.ts
import { create } from "zustand";

interface OrderResponse {
  id: string;
  [key: string]: any;
  data: {
    email: string | null | undefined;
    username: string | null | undefined;
    amount: number | null | undefined;
    products: string[];
  };
}

interface OrderData {
  productId: string;
  quantity: number;
  [key: string]: any; // Add additional fields as needed
}

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

interface OrderState {
  orders: OrderResponse[];
  orderId: string | null;
  setOrderId: (orderId: string) => void; // Add method to set orderId
  loading: boolean;
  error: string | null;
  createOrder: (data: OrderData) => Promise<void>;
  getOrderItems: (email: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  orderId: null,
  loading: false,
  error: null,
  createOrder: async (data: OrderData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      const newOrder = await response.json();
      console.log("API Response:", newOrder); // Debug: Log full response

      // Adjust this based on actual API response structure
      const documentId = newOrder?.data?.documentId;
      console.log("Extracted documentId:", documentId); // Debug: Confirm documentId

      if (!documentId) {
        throw new Error("Document ID not found in response");
      }

      set((state) => {
        console.log("Setting state with orderId:", documentId); // Debug: Before state update
        return {
          orders: [...state.orders, newOrder],
          orderId: documentId, // Directly set orderId
          loading: false,
        };
      });

      // Verify state after update
      console.log(
        "Updated orderId in store:",
        useOrderStore.getState().orderId
      );

      return documentId;
    } catch (error) {
      console.error("Error in createOrder:", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
  getOrderItems: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams();
      query.append("populate[products][populate][0]", "banner");
      query.append("populate[tools]", "*");
      query.append("filters[email][$eq]", email);

      const response = await fetch(`${apiUrl}/api/orders?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      const data = await response.json();
      set({ orders: data.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
  setOrderId: (orderId: string) => {
    set({ orderId });
  },
}));
