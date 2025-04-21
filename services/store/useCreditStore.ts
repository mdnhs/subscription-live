// @/_store/creditStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CreditState {
  isCredit: boolean;
  setIsCredit: (value: boolean) => void;
}

export const useCreditStore = create<CreditState>()(
  persist(
    (set) => ({
      isCredit: false,
      setIsCredit: (value) => set({ isCredit: value }),
    }),
    {
      name: 'credit-storage',
    }
  )
);