import { create } from 'zustand';

export type CartItem = {
  documentId: string;
  title: string;
  price: number;
  category: string;
  month: number;
  banner?: {
    url: string;
  };
};

type CartStore = {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (documentId: string) => void;
  clearCart: () => void;
};

const useCartStore = create<CartStore>((set) => ({
  cartItems: [],
  loading: false,
  addToCart: (item) => set((state) => ({ cartItems: [...state.cartItems, item] })),
  removeFromCart: (documentId) => 
    set((state) => ({ 
      cartItems: state.cartItems.filter(item => item.documentId !== documentId) 
    })),
  clearCart: () => set({ cartItems: [] }),
}));

export default useCartStore;