// _store/ProductStore.ts
import { Product } from "@/_types/product";
import { create } from "zustand";

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

interface ProductState {
  products: Product[]; // All products (e.g., latest or by category)
  product: Product | null; // Single product by ID
  loading: boolean;
  error: string | null; // Added error state for better feedback
  cachedProducts: { [key: string]: Product[] }; // Cache for products by category or latest
  cachedProductById: { [key: string]: Product }; // Cache for products by ID
  isFetching: { [key: string]: boolean }; // Lock to prevent concurrent fetches
  getLatestProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  getProductsByCategory: (category: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  product: null,
  loading: false, // Start as false, only true during fetch
  error: null,
  cachedProducts: {}, // e.g., { "latest": [...], "electronics": [...] }
  cachedProductById: {}, // e.g., { "1": {...}, "2": {...} }
  isFetching: {}, // e.g., { "latest": false, "product_1": false, "category_electronics": false }

  getLatestProducts: async () => {
    const cacheKey = "latest";
    const state = get();

    // Check cache first
    if (state.cachedProducts[cacheKey] && state.cachedProducts[cacheKey].length > 0) {
      set({ products: state.cachedProducts[cacheKey], loading: false, error: null });
      return;
    }

    // Check if already fetching
    if (state.isFetching[cacheKey]) return;

    set({ loading: true, error: null, isFetching: { ...state.isFetching, [cacheKey]: true } });
    try {
      const response = await fetch(`${apiUrl}/api/products?populate=*`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      const data = await response.json();
      const products = data?.data as Product[];
      set({
        products,
        cachedProducts: { ...state.cachedProducts, [cacheKey]: products },
        loading: false,
        error: null,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      set({
        loading: false,
        error: errorMessage,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    }
  },

  getProductById: async (id: string) => {
    const cacheKey = `product_${id}`;
    const state = get();

    // Check cache first
    if (state.cachedProductById[id]) {
      set({ product: state.cachedProductById[id], loading: false, error: null });
      return;
    }

    // Check if already fetching
    if (state.isFetching[cacheKey]) return;

    set({ loading: true, error: null, isFetching: { ...state.isFetching, [cacheKey]: true } });
    try {
      const response = await fetch(`${apiUrl}/api/products/${id}?populate=*`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }
      const data = await response.json();
      const product = data?.data as Product;
      set({
        product,
        cachedProductById: { ...state.cachedProductById, [id]: product },
        loading: false,
        error: null,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      set({
        loading: false,
        error: errorMessage,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    }
  },

  getProductsByCategory: async (category: string) => {
    const cacheKey = `category_${category}`;
    const state = get();

    // Check cache first
    if (state.cachedProducts[cacheKey] && state.cachedProducts[cacheKey].length > 0) {
      set({ products: state.cachedProducts[cacheKey], loading: false, error: null });
      return;
    }

    // Check if already fetching
    if (state.isFetching[cacheKey]) return;

    set({ loading: true, error: null, isFetching: { ...state.isFetching, [cacheKey]: true } });
    try {
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
      const data = await response.json();
      const products = data?.data as Product[];
      set({
        products,
        cachedProducts: { ...state.cachedProducts, [cacheKey]: products },
        loading: false,
        error: null,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      set({
        loading: false,
        error: errorMessage,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    }
  },
}));