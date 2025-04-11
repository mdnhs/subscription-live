// src/store/sessionStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  setSession: (session: Session) => void;
  clearSession: () => void;
}

// Create the Zustand store with persist middleware
const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: 'session-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage (default)
    }
  )
);

export default useSessionStore;