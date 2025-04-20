"use client";
import { setFormattedExpireDate } from "@/function/dateFormatter";
import { updateCoupon } from "@/services/api/couponRequest";
import { getUserOrders, updateOrder } from "@/services/api/orderRequest";
import { updateTool } from "@/services/api/toolRequest";
import { getReferUser, updateUser } from "@/services/api/userRequest";
import useFetch from "@/services/fetch/csrFecth";
import { useCouponStore } from "@/services/store/useCouponStore";
import useGrantedToolsStore from "@/services/store/useGrantedToolsStore";
import useOrderStore from "@/services/store/useOrderStore";
import useSessionStore from "@/services/store/useSessionStore";
import { CircleCheckBig, House, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ConfirmPayment = () => {
  const searchParams = useSearchParams();
  const paymentID = searchParams.get("paymentID");

  // Stores
  const { order, clearOrder } = useOrderStore();
  const { appliedCoupons, clearCoupons } = useCouponStore();
  const { currentUser } = useSessionStore();
  const { currentTool, clearGrantedTools } = useGrantedToolsStore();

  // Session
  const { data: session, status } = useSession();

  // API
  const { fetchPublic } = useFetch();

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  console.log(isLoading);
  // Refs to prevent re-renders
  const orderRef = useRef(order);
  const processedRef = useRef(false);
  const currentToolRef = useRef(currentTool);
  const appliedCouponsRef = useRef(appliedCoupons);
  const currentUserRef = useRef(currentUser);
  const sessionRef = useRef(session);
  const expireDateRef = useRef<string | Date | null>(null);

  // Update refs when their values change
  useEffect(() => {
    orderRef.current = order;
    currentToolRef.current = currentTool;
    appliedCouponsRef.current = appliedCoupons;
    currentUserRef.current = currentUser;
    sessionRef.current = session;

    // Calculate expireDate when order data is available
    if (order?.createdAt && order?.month !== undefined) {
      expireDateRef.current = setFormattedExpireDate(
        order.createdAt,
        order.month
      );
    }
  }, [order, currentTool, appliedCoupons, currentUser, session]);

  // Handle client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Process payment function
  const processPayment = useCallback(async () => {
    // If already processed or missing requirements, skip
    if (processedRef.current || !paymentID || !orderRef.current?.documentId) {
      setIsLoading(false);
      return;
    }

    const orderId = orderRef.current.documentId;
    const currentSession = sessionRef.current;

    // Check authentication
    if (status !== "authenticated" || !currentSession?.user?.email) {
      setIsLoading(false);
      return;
    }

    // Calculate expireDate if not already done
    if (
      !expireDateRef.current &&
      orderRef.current?.createdAt &&
      orderRef.current?.month !== undefined
    ) {
      expireDateRef.current = setFormattedExpireDate(
        orderRef.current.createdAt,
        orderRef.current.month
      );
    }

    // If still no expireDate, calculate with fallback values
    if (!expireDateRef.current) {
      expireDateRef.current = setFormattedExpireDate(
        new Date().toISOString(),
        0
      );
    }

    setIsLoading(true);

    try {
      // Step 1: Update order
      const orderPayload = {
        data: {
          TxnID: paymentID,
          isPaid: true,
          expireDate: expireDateRef.current,
        },
      };

      const orderReq = updateOrder({ data: orderPayload.data }, orderId);
      const orderResponse = await fetchPublic(orderReq);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to update order");
      }

      // Step 2: Update tool statistics if available
      const tool = currentToolRef.current;
      if (tool?.documentId) {
        const toolPayload = {
          data: { totalOrder: (tool.totalOrder || 0) + 1 },
        };

        const toolReq = updateTool(tool.documentId, toolPayload);
        await fetchPublic(toolReq);
      }

      // Step 3: Check if first order
      const userEmail = currentSession.user.email;
      const ordersReq = getUserOrders(userEmail);
      const ordersResponse = await fetchPublic(ordersReq);

      const isFirstOrder =
        ordersResponse.success &&
        ordersResponse.data &&
        ordersResponse.data.data?.length === 1;

      // Step 4: Handle referral if first order
      const user = currentUserRef.current;
      if (isFirstOrder && user?.via) {
        const referReq = getReferUser(user.via);
        const referResponse = await fetchPublic(referReq);

        if (referResponse.success && referResponse.data?.[0]) {
          const viaUser = referResponse.data[0];
          const referUpdatePayload = {
            refCredit: (viaUser.refCredit || 0) + 1,
          };

          const referUpdateReq = updateUser(
            currentSession.user.jwt,
            viaUser.id,
            referUpdatePayload
          );
          await fetchPublic(referUpdateReq);
        }
      }

      // Step 5: Update coupon usage
      const coupons = appliedCouponsRef.current;
      if (coupons.length > 0 && coupons[0]?.documentId) {
        const couponData = coupons[0];

        const updatedUsedCount = (couponData.usedCount || 0) + 1;
        const updatedUserUsage = { ...(couponData.userUsage || {}) };

        if (userEmail) {
          updatedUserUsage[userEmail] = (updatedUserUsage[userEmail] || 0) + 1;
        }

        const couponPayload = {
          data: {
            usedCount: updatedUsedCount,
            userUsage: updatedUserUsage,
          },
        };

        const couponReq = updateCoupon(couponData.documentId, couponPayload);
        await fetchPublic(couponReq);
      }

      // Success notification
      toast.success("Payment processed successfully!");

      // Clean up stores
      clearOrder();
      clearCoupons();
      clearGrantedTools();

      // Mark as processed to prevent duplicate processing
      processedRef.current = true;
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process payment. Please contact support."
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    paymentID,
    status,
    fetchPublic,
    clearOrder,
    clearCoupons,
    clearGrantedTools,
  ]);

  // Trigger payment processing once when component is hydrated
  useEffect(() => {
    if (isHydrated && !processedRef.current) {
      processPayment();
    }
  }, [isHydrated, processPayment]);

  if (!isHydrated) {
    return <div></div>;
  }

  return (
    <div className="container h-fit ">
      <div className="flex flex-col gap-8 items-center justify-center bg-brand-3/40 backdrop-blur-2xl text-white rounded-2xl py-40">
        <>
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
        </>
      </div>
    </div>
  );
};

export default ConfirmPayment;
