import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  documentId: string;
  title: string;
  price: number;
  category: string;
  month: number;
  isOffer?: boolean;
  offerAmount: number;
  banner?: {
    url: string;
  };
};

interface CartStore {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (documentId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartItems: [],
      loading: false,
      addToCart: (item) =>
        set((state) => ({ cartItems: [...state.cartItems, item] })),
      removeFromCart: (documentId) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.documentId !== documentId
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
