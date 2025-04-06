// _store/UserStore.ts
import { create } from "zustand";

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  getCurrentUser: (jwtToken: string) => Promise<void>;
}

const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL || "http://localhost:1337"; // Fallback URL

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  getCurrentUser: async (jwtToken: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/api/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const userData = await response.json();
      set({
        user: userData as User,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching user:", error);
      set({
        user: null,
        loading: false,
        error: errorMessage,
      });
    }
  },
}));
