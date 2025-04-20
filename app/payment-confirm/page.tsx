"use client";
import { setFormattedExpireDate } from "@/function/dateFormatter";
import { updateCoupon } from "@/services/api/couponRequest";
import { updateOrder } from "@/services/api/orderRequest";
import { updateTool } from "@/services/api/toolRequest";
import useFetch from "@/services/fetch/csrFecth";
import useGrantedToolsStore from "@/services/store/useGrantedToolsStore";
import useOrderStore from "@/services/store/useOrderStore";
import { CircleCheckBig, House, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCouponStore } from "@/services/store/useCouponStore";

const PageContent = () => {
  const searchParams = useSearchParams();
  const paymentID = searchParams.get("paymentID");
  const { order, clearOrder } = useOrderStore();
  const { appliedCoupons, clearCoupons } = useCouponStore(); // Use store instead of localStorage
  const [couponUpdated, setCouponUpdated] = useState(false);
  const { data: session, status } = useSession();

  const { fetchPublic } = useFetch();
  const orderId = order?.documentId;
  const createDate = order?.createdAt;
  const toolTerm = order?.month;
  const expireDate = setFormattedExpireDate(
    createDate ?? new Date().toISOString(),
    toolTerm ?? 0
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const { currentTool, clearGrantedTools } = useGrantedToolsStore();

  // Handle client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Process order update
  useEffect(() => {
    if (!isHydrated || !orderId || !paymentID) {
      return;
    }

    const processOrder = async () => {
      const payload = {
        data: {
          TxnID: paymentID,
          isPaid: true,
          expireDate: expireDate,
        },
      };

      try {
        const req = updateOrder({ data: payload.data }, orderId);
        const response = await fetchPublic(req);

        if (currentTool?.documentId) {
          const _payload = {
            data: { totalOrder: (currentTool?.totalOrder || 0) + 1 },
          };
          const _req = updateTool(currentTool.documentId, _payload);
          await fetchPublic(_req);
        }

        if (!response.success) {
          throw new Error(response.message || "Failed to update order.");
        }

        toast.success("Order updated successfully!");
        return response.data;
      } catch (error) {
        console.error("Order update error:", error);
        toast.error(
          (error instanceof Error
            ? error.message
            : "An unknown error occurred") || "Failed to update order."
        );
        return null;
      }
    };

    processOrder();
    clearGrantedTools();
    clearOrder();
  }, [
    fetchPublic,
    orderId,
    paymentID,
    isHydrated,
    expireDate,
    currentTool?.documentId,
    currentTool?.totalOrder,
    clearGrantedTools,
    clearOrder,
  ]);

  // Handle coupon update
  useEffect(() => {
    if (
      couponUpdated ||
      !isHydrated ||
      appliedCoupons.length === 0 ||
      !appliedCoupons[0]?.documentId
    ) {
      return;
    }

    if (status !== "authenticated" || !session?.user?.email) {
      console.warn("User not authenticated or email not available");
      return;
    }

    const updateCouponDetails = async () => {
      try {
        const couponData = appliedCoupons[0]; // Use first coupon from store
        const currentUserEmail = session.user.email;

        const updatedUsedCount = (couponData.usedCount || 0) + 1;
        const updatedUserUsage = { ...(couponData.userUsage || {}) };

        if (currentUserEmail && currentUserEmail in updatedUserUsage) {
          updatedUserUsage[currentUserEmail] =
            (updatedUserUsage[currentUserEmail] || 0) + 1;
        } else if (currentUserEmail) {
          updatedUserUsage[currentUserEmail] = 1;
        }

        const payload = {
          data: {
            usedCount: updatedUsedCount,
            userUsage: updatedUserUsage,
          },
        };

        console.log(
          "Updating coupon:",
          couponData.documentId,
          "with payload:",
          payload
        );

        const req = updateCoupon(couponData.documentId, payload);
        const response = await fetchPublic(req);

        if (!response.success) {
          throw new Error(response.message || "Failed to update coupon");
        }

        console.log("Coupon updated successfully");
        toast.success("Coupon updated successfully!");
        setCouponUpdated(true);
        // Do NOT call clearCoupons() to persist coupon data
      } catch (error) {
        console.error("Coupon update error:", error);
        toast.error("Failed to update coupon usage");
      }
    };

    updateCouponDetails();
    clearCoupons();
  }, [
    appliedCoupons,
    fetchPublic,
    isHydrated,
    status,
    session,
    couponUpdated,
    clearCoupons,
  ]);

  return (
    <div className="container">
      <div className="flex flex-col gap-8 min-h-screen items-center justify-center bg-background/95 text-white rounded-2xl">
        <CircleCheckBig className="size-36 text-teal-600" />
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-[24px]">Payment Successful!</h2>
          <h2 className="text-sm">Transaction ID: {paymentID ?? "N/A"}</h2>

          <h2 className="text-[17px] text-center text-gray-200">
            We sent an email with your order confirmation along with Digital
            Content
          </h2>
        </div>
        <div className="flex gap-4">
          <Link
            href="/"
            className="rounded bg-teal-600 px-5 py-3 text-sm text-white transition hover:bg-teal-700 flex gap-2 items-center"
          >
            <House size={18} /> Home
          </Link>
          <Link
            href="/my-account?tab=my-orders"
            className="flex gap-2 rounded bg-teal-600 px-5 py-3 text-sm text-white transition hover:bg-teal-700"
          >
            <ShoppingBag size={18} /> My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
