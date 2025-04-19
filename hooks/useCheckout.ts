"use client";
import useCartStore from "@/_store/CartStore";
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

const useCheckout = (tools: ToolsResponse[]) => {
  const { data: session } = useSession();
  const { cartItems, loading, clearCart } = useCartStore();
  const { setOrder } = useOrderStore();
  const { fetchPublic } = useFetch();
  const searchParams = useSearchParams();
  const fetchedRef = useRef(false);
  const { setCurrentTool } = useGrantedToolsStore();

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
  } = useCartCalculations(cartItems, tools, distributions);

  // Sync local showSupportMessage with cartShowSupportMessage
  useEffect(() => {
    setShowSupportMessage(cartShowSupportMessage);
  }, [cartShowSupportMessage]);

  // Check for payment cancellation or failure
  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "cancel" || message === "failure") {
      toast.error("Payment failed. Please try again.");
    }
  }, [searchParams]);

  // Fetch distributions with useRef to ensure it runs exactly once
  useEffect(() => {
    const fetchDistributions = async () => {
      if (session?.user?.email && !fetchedRef.current) {
        try {
          fetchedRef.current = true; // Set this before the API call to prevent race conditions
          const req = getDistributionItems();
          const response = await fetchPublic(req);
          if (!response.success) {
            throw new Error(response.message || "Get Distribution failed");
          }
          setDistributions(response.data.data);
        } catch (error) {
          console.error("Error fetching distributions:", error);
          toast.error("Failed to fetch distribution data.");
          // Don't reset fetchedRef on error to prevent retries
        }
      }
    };
    fetchDistributions();
  }, [session?.user?.email, fetchPublic]);

  // Calculate total
  useEffect(() => {
    calculateTotal();
  }, [cartItems, loading, calculateTotal]);

  // Update tool selection
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

    setIsProcessing(true);
    try {
      await createOrderAndUpdateCart();
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
        clearCart();
        window.location.href = sessionData.bkashURL;
      } else {
        toast.error("Failed to initiate bKash payment.");
      }
    } catch (error) {
      console.error("bKash payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    loading,
    total,
    isProcessing,
    handleBkashPayment,
    selectedPayment,
    setSelectedPayment,
    showSupportMessage,
  };
};

export default useCheckout;
