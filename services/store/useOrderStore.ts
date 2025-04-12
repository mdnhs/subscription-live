// src/store/useOrderStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define interface for the order data
interface Order {
  id: number;
  documentId: string;
  email: string;
  username: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  category: string;
  month: number;
  TxnID: string | null;
  isPaid: boolean | null;
  products?: string[]; // Optional, based on payload
  tools?: string[];    // Optional, based on payload
}

interface OrderState {
  order: Order | null;
  setOrder: (order: Order) => void;
  clearOrder: () => void;
}

// Create the Zustand store with persist middleware
const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      order: null,
      setOrder: (order) => set({ order }),
      clearOrder: () => set({ order: null }),
    }),
    {
      name: 'order-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);

export default useOrderStore;