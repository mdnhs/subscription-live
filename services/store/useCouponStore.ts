import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Coupon } from "@/_types/coupon";

interface CouponState {
  appliedCoupons: Coupon[];
  currentCoupon: Coupon | null;
  loading: boolean;
  error: string | null;
  addCoupon: (coupon: Coupon) => void;
  removeCoupon: (documentId: string) => void;
  updateCoupon: (documentId: string, updates: Partial<Coupon>) => void;
  setCoupons: (coupons: Coupon[]) => void;
  setCurrentCoupon: (coupon: Coupon | null) => void;
  clearCoupons: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      appliedCoupons: [],
      currentCoupon: null,
      loading: false,
      error: null,
      addCoupon: (coupon) =>
        set((state) => {
          // Prevent duplicate coupons
          const exists = state.appliedCoupons.some(
            (c) => c.documentId === coupon.documentId
          );
          if (exists) {
            return state;
          }
          return { appliedCoupons: [...state.appliedCoupons, coupon] };
        }),
      removeCoupon: (documentId) =>
        set((state) => ({
          appliedCoupons: state.appliedCoupons.filter(
            (c) => c.documentId !== documentId
          ),
        })),
      updateCoupon: (documentId, updates) =>
        set((state) => ({
          appliedCoupons: state.appliedCoupons.map((coupon) =>
            coupon.documentId === documentId ? { ...coupon, ...updates } : coupon
          ),
        })),
      setCoupons: (coupons) => set({ appliedCoupons: coupons }),
      setCurrentCoupon: (coupon) => set({ currentCoupon: coupon }),
      clearCoupons: () => set({ appliedCoupons: [], currentCoupon: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "coupon-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        appliedCoupons: state.appliedCoupons,
        currentCoupon: state.currentCoupon,
      }),
    }
  )
);