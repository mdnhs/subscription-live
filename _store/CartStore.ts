import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartData {
  productId?: string;
  [key: string]: any;
  data: {
    username: string | null | undefined;
    email: string | null | undefined;
    products: string[];
  };
}

interface CartResponse {
  id: string;
  productId: string; // Add this to match CartData
  [key: string]: any;
}

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

interface CartState {
  carts: CartResponse[];
  loading: boolean;
  isCartOpen: boolean;
  error: string | null;
  addToCart: (data: CartData) => Promise<void>;
  getCartItems: (email: string) => Promise<void>;
  deleteCart: (id: string) => Promise<void>;
  setCartOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carts: [],
      loading: false,
      isCartOpen: false,
      error: null,
      addToCart: async (data: CartData) => {
        const currentCarts = get().carts;
        const productsId = data?.data?.products[0];
        // Check if item with same productId already exists
        const itemExists = currentCarts.some(
          (cart) => cart?.products[0]?.documentId === productsId
        );
        
        if (itemExists) {
          // Delete all cart items when the item already exists
          set({ loading: true });
          
          try {
            // Delete all cart items
            await Promise.all(
              currentCarts.map((item) =>
                item?.id ? get().deleteCart(item.id) : Promise.resolve()
              )
            );
            
            // After clearing cart, add the new item
            await addNewItem(data);
            
            // Set success message
            toast.success("Cart updated", {
              description: "Previous items removed and new item added to your cart",
              duration: 3000,
            });
            
            return; // Exit the function early
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : String(error),
            });
            return;
          }
        } else {
          // If item doesn't exist, just add it normally
          await addNewItem(data);
        }
        
        // Helper function to add new item
        async function addNewItem(itemData: CartData) {
          set({ loading: true, error: null });
          try {
            const response = await fetch(`${apiUrl}/api/carts`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(itemData),
            });

            if (!response.ok) {
              throw new Error(`Failed to add to cart: ${response.statusText}`);
            }
            
            const newCart = await response.json();
            set((state) => ({
              carts: [...state.carts, newCart],
              loading: false,
              isCartOpen: true,
            }));
            
            toast.success("Added to Cart", {
              description: `Tools has been added to your cart.`,
              duration: 3000,
            });
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
      },
      getCartItems: async (email: string) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(
            `${apiUrl}/api/carts?populate[products][populate]=banner&filters[email][$eq]=${email}`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch cart items: ${response.statusText}`
            );
          }
          const data = await response.json();
          set({ carts: data?.data, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
      deleteCart: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${apiUrl}/api/carts/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to delete cart: ${response.statusText}`);
          }
          set((state) => ({
            carts: state.carts.filter((cart) => cart.id !== id),
            loading: false,
          }));
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
      setCartOpen: (open: boolean) => set({ isCartOpen: open }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ carts: state.carts }),
    }
  )
);
