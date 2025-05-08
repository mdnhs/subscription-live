"use client";
import { ToolsResponse } from "@/_types/product";
import { getDistributionItems } from "@/services/api/distributionRequest";
import { createOrder } from "@/services/api/orderRequest";
import useFetch from "@/services/fetch/csrFecth";
import useGrantedToolsStore from "@/services/store/useGrantedToolsStore";
import useOrderStore from "@/services/store/useOrderStore";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useCartCalculations from "./useCartCalculations";
import { useCartStore } from "@/_store/CartStore";
import { useCouponStore } from "@/services/store/useCouponStore";
import { randomBytes } from "crypto";

const useCheckout = (tools: ToolsResponse[]) => {
  const { data: session } = useSession();
  const { cartItems, loading, clearCart } = useCartStore();
  const { setOrder } = useOrderStore();
  const { fetchPublic } = useFetch();
  const searchParams = useSearchParams();
  const fetchedRef = useRef(false);
  const { setCurrentTool } = useGrantedToolsStore();
  const { setCoupons } = useCouponStore();
  const [selectedPayment, setSelectedPayment] = useState<string>("bkash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [distributions, setDistributions] = useState<
    { toolName: string; numberOfUser: number }[]
  >([]);
  const [showSupportMessage, setShowSupportMessage] = useState(false);

  const {
    total,
    products,
    grantedTool,
    grantedToolDetails,
    productCategory,
    productMonth,
    showSupportMessage: cartShowSupportMessage,
    calculateTotal,
    updateToolSelection,
    appliedCoupons,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCartCalculations(cartItems, tools, distributions);
  useEffect(() => {
    setShowSupportMessage(cartShowSupportMessage);
  }, [cartShowSupportMessage]);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "cancel" || message === "failure") {
      toast.error("Payment failed. Please try again.");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDistributions = async () => {
      if (session?.user?.email && !fetchedRef.current) {
        try {
          fetchedRef.current = true;
          const req = getDistributionItems();
          const response = await fetchPublic(req);
          if (!response.success) {
            throw new Error(response.message || "Get Distribution failed");
          }
          setDistributions(response.data.data);
        } catch (error) {
          console.error("Error fetching distributions:", error);
          toast.error("Failed to fetch distribution data.");
        }
      }
    };
    fetchDistributions();
  }, [session?.user?.email, fetchPublic]);

  useEffect(() => {
    calculateTotal();
  }, [cartItems, loading, calculateTotal]);

  useEffect(() => {
    updateToolSelection();
  }, [cartItems, tools, distributions, updateToolSelection]);

  const createOrderAndUpdateCart = async () => {
    if (!session?.user?.email) {
      toast.error("Please sign in to create an order.");
      return null;
    }

    const payload = {
      data: {
        email: session.user.email,
        username: session.user.name || "",
        amount: total,
        products,
        category: productCategory,
        month: productMonth,
        tools: grantedTool,
      },
    };

    try {
      const req = createOrder(payload);
      const response = await fetchPublic(req);
      if (!response.data) {
        throw new Error("No data returned from order creation.");
      }
      setOrder(response?.data?.data);

      // Update coupon usage (mock for now, replace with API call)
      for (const coupon of appliedCoupons) {
        console.log(`Incremented usage for coupon ${coupon.code}`);
      }

      return response?.data?.data;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to create order.");
      return null;
    }
  };

  const handleBkashPayment = async () => {
    if (!cartItems?.length || !session?.user || showSupportMessage) {
      toast.error("Cannot proceed with payment.");
      return;
    }
    if (!grantedToolDetails.documentId) {
      toast.error("No available tool selected.");
      return;
    }
    const randomUUID = randomBytes(10).toString("hex");

    try {
      await createOrderAndUpdateCart();

      // If the item is free, skip payment API call and redirect directly
      if (cartItems[0]?.isFree) {
        setCurrentTool(grantedToolDetails);
        setCoupons(appliedCoupons);
        clearCart();
        window.location.href = `/payment-confirm?success=${true}&paymentID=FREE${randomUUID}`;
        return;
      }

      // Only reach here if the item is not free
      const response = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total.toString(),
          name: session.user.name,
          email: session.user.email,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        toast.error(
          response.status === 409
            ? "Please refresh the page and try again."
            : errorMessage.statusMessage ||
                "Please refresh the page and try again."
        );
        return;
      }

      const sessionData = await response.json();
      if (sessionData.bkashURL) {
        setCurrentTool(grantedToolDetails);
        setCoupons(appliedCoupons);
        clearCart();
        window.location.href = sessionData.bkashURL;
      } else {
        toast.error("Failed to initiate payment.");
      }
    } catch (error) {
      console.error("payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    loading,
    total,
    isFree: cartItems[0]?.isFree,
    isProcessing,
    handleBkashPayment,
    selectedPayment,
    setSelectedPayment,
    showSupportMessage,
    appliedCoupons,
    couponError,
    applyCoupon,
    removeCoupon,
  };
};

export default useCheckout;
