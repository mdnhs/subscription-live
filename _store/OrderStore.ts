"use client";

import { create } from "zustand";

interface OrderResponse {
  id: string;
  attributes: {
    email: string | null;
    username: string | null;
    amount: number | null;
    products: { data: any[] };
    tools: { data: any[] };
    category: string | null;
    month: number | null;
    [key: string]: any;
  };
}

interface OrderData {
  data: {
    email: string | null | undefined;
    username: string | null | undefined;
    amount: number | null | undefined;
    products: string[];
    category?: string;
    month?: number;
    tools: string[];
  };
  productId: string;
  quantity: number;
}

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

interface OrderState {
  orders: OrderResponse[];
  loading: boolean;
  error: string | null;
  createOrder: (data: OrderData) => Promise<void>;
  getOrderItems: (email: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,
  error: null,
  createOrder: async (data: OrderData) => {
    set({ loading: true, error: null });
  
    const payload = {
      data: {
        email: data.data.email,
        username: data.data.username,
        amount: data.data.amount,
        products: data.data.products,
        category: data.data.category,
        month: data.data.month,
        tools: data.data.tools, // Ensure this is an array of documentId strings
      },
      productId: data.productId,
      quantity: data.quantity,
    };
  
    console.log("Order payload being sent to Strapi:", JSON.stringify(payload, null, 2));
  
    try {
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Strapi response error:", response.status, errorText);
        throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
      }
  
      const newOrder = await response.json();
      console.log("Strapi response:", newOrder);
      set((state) => ({
        orders: [...state.orders, newOrder.data],
        loading: false,
      }));
    } catch (error) {
      console.error("Create order error:", error);
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
}));