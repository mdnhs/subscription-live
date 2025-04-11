// _store/UserStore.ts
import { create } from "zustand";

export interface User {
  id: number;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  birthDate?: string;
  phoneNumber?: string;
  gender?: "male" | "female" | "other";
  religion?: "islam" | "hinduism" | "christianity" | "buddhism" | "other";
  isAdmin?: boolean;
}

interface UserState {
  user: User | null;
  totalUsers: number | null;
  loading: boolean;
  error: string | null;
  cachedUser: { [jwtToken: string]: User }; // Cache user by JWT token
  cachedTotalUsers: number | null; // Cache total users
  isFetching: { [key: string]: boolean }; // Lock to prevent concurrent fetches
  getCurrentUser: (jwtToken: string) => Promise<void>;
  getTotalUsers: () => Promise<void>;
  updateUser: (jwtToken: string, data: Partial<User>) => Promise<void>;
  updatePassword: (jwtToken: string, currentPassword: string, newPassword: string) => Promise<void>;
  uploadProfilePicture: (jwtToken: string, file: File) => Promise<string>;
}

const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL || "http://localhost:1337";
const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  totalUsers: null,
  loading: false,
  error: null,
  cachedUser: {}, // e.g., { "jwt1": { id: 1, username: "user1", ... } }
  cachedTotalUsers: null,
  isFetching: {}, // e.g., { "currentUser_jwt1": false, "totalUsers": false }

  getCurrentUser: async (jwtToken: string) => {
    const cacheKey = `currentUser_${jwtToken}`;
    const state = get();

    // Check cache first
    if (state.cachedUser[jwtToken]) {
      set({ user: state.cachedUser[jwtToken], loading: false, error: null });
      return;
    }

    // Check if already fetching
    if (state.isFetching[cacheKey]) return;

    set({ loading: true, error: null, isFetching: { ...state.isFetching, [cacheKey]: true } });
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
        cachedUser: { ...state.cachedUser, [jwtToken]: userData as User },
        loading: false,
        error: null,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching user:", error);
      set({
        user: null,
        loading: false,
        error: errorMessage,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    }
  },

  getTotalUsers: async () => {
    const cacheKey = "totalUsers";
    const state = get();

    // Check cache first
    if (state.cachedTotalUsers !== null) {
      set({ totalUsers: state.cachedTotalUsers, loading: false, error: null });
      return;
    }

    // Check if already fetching
    if (state.isFetching[cacheKey]) return;

    set({ loading: true, error: null, isFetching: { ...state.isFetching, [cacheKey]: true } });
    try {
      const response = await fetch(`${apiUrl}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users from Strapi");
      }
      const userData = await response.json();
      const total = userData?.length;
      set({
        totalUsers: total,
        cachedTotalUsers: total,
        loading: false,
        error: null,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching users:", error);
      set({
        loading: false,
        error: errorMessage,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    }
  },

  updateUser: async (jwtToken: string, data: Partial<User>) => {
    const cacheKey = `updateUser_${jwtToken}`;
    const state = get();

    // Check if already fetching
    if (state.isFetching[cacheKey]) return;

    set({ loading: true, error: null, isFetching: { ...state.isFetching, [cacheKey]: true } });
    try {
      const userId = state.user?.id;
      if (!userId) throw new Error("No user ID available");

      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update user: ${errorData.error?.message || response.statusText}`
        );
      }

      const updatedUser = await response.json();
      set({
        user: updatedUser as User,
        cachedUser: { ...state.cachedUser, [jwtToken]: updatedUser as User }, // Update cache
        loading: false,
        error: null,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      set({
        loading: false,
        error: errorMessage,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    }
  },

  updatePassword: async (jwtToken: string, currentPassword: string, newPassword: string) => {
    const cacheKey = `updatePassword_${jwtToken}`;
    const state = get();

    // Check if already fetching
    if (state.isFetching[cacheKey]) return;

    set({ loading: true, error: null, isFetching: { ...state.isFetching, [cacheKey]: true } });
    try {
      const response = await fetch(`${apiUrl}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          passwordConfirmation: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update password: ${errorData.error?.message || response.statusText}`
        );
      }

      set({
        loading: false,
        error: null,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      set({
        loading: false,
        error: errorMessage,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
    }
  },

  uploadProfilePicture: async (jwtToken: string, file: File): Promise<string> => {
    const cacheKey = `uploadProfilePicture_${jwtToken}_${file.name}`; // Unique key per file
    const state = get();

    // Check if already fetching
    if (state.isFetching[cacheKey]) {
      throw new Error("Upload already in progress");
    }

    set({ loading: true, error: null, isFetching: { ...state.isFetching, [cacheKey]: true } });
    try {
      const formData = new FormData();
      formData.append("files", file);
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to upload profile picture: ${errorData.error?.message || response.statusText}`
        );
      }

      const uploadData = await response.json();
      const imageUrl = uploadData[0].url;
      set({
        loading: false,
        error: null,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
      return imageUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      set({
        loading: false,
        error: errorMessage,
        isFetching: { ...state.isFetching, [cacheKey]: false },
      });
      throw error;
    }
  },
}));