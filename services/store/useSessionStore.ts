// src/store/sessionStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User as UserType } from "@/_types/usersTypes";

// Define interfaces for the session data
interface User {
  id: string;
  name: string;
  email: string;
  jwt: string;
}

interface Session {
  user: User;
  expires: string;
}

interface SessionState {
  session: Session | null;
  currentUser: UserType | null;
  setSession: (session: Session) => void;
  setCurrentUser: (user: UserType) => void;
  clearSession: () => void;
}

// Create the Zustand store with persist middleware
const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      currentUser: null,
      setSession: (session) => set({ session }),
      setCurrentUser: (currentUser) => set({ currentUser }),
      clearSession: () => set({ session: null, currentUser: null }),
    }),
    {
      name: "session-storage", // Key in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage (default)
    }
  )
);

export default useSessionStore;
