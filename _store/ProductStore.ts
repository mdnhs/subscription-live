// _store/ProductStore.ts
import { Product } from "@/_types/product";
import { create } from "zustand";

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  getLatestProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  getProductsByCategory: (category: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  product: null,
  loading: true, // Initial loading state is fine as true
  getLatestProducts: async () => {
    set({ loading: true });
    const response = await fetch(`${apiUrl}/api/products?populate=*`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    set({ products: data?.data as Product[], loading: false });
  },
  getProductById: async (id: string) => {
    set({ loading: true });
    const response = await fetch(`${apiUrl}/api/products/${id}?populate=*`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    const data = await response.json();
    set({ product: data?.data as Product, loading: false });
  },
  getProductsByCategory: async (category: string) => {
    set({ loading: true });
    const response = await fetch(
      `${apiUrl}/api/products?filters[category][$eq]=${category}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data: Product[] = await response.json();
    set({ products: data, loading: false });
  },
}));
