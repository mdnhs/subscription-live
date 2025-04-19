"use client";
import { setFormattedExpireDate } from "@/function/dateFormatter";
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

const PageContent = () => {
  const searchParams = useSearchParams();
  const paymentID = searchParams.get("paymentID");
  const { order } = useOrderStore();
  const { fetchPublic } = useFetch();
  const orderId = order?.documentId;
  const createDate = order?.createdAt;
  const toolTerm = order?.month;
  const expireDate = setFormattedExpireDate(
    createDate ?? new Date().toISOString(),
    toolTerm ?? 0
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const { currentTool } = useGrantedToolsStore(); // Use the granted tools store

  console.log(currentTool);
  // Detect when store is hydrated
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Wait for hydration, orderId, and paymentID
    if (!isHydrated || !orderId || !paymentID) {
      return; // Silently wait until both are available
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
        const _payload = {
          data: { totalOrder: (currentTool?.totalOrder || 0) + 1 },
        };
        const _req = updateTool(currentTool?.documentId, _payload);
        await fetchPublic(_req);
        if (!response.success) {
          throw new Error(response.message || "Failed to update order.");
        }

        const { data } = response;
        return data;
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
  }, [
    fetchPublic,
    orderId,
    paymentID,
    isHydrated,
    expireDate,
    currentTool?.documentId,
    currentTool?.totalOrder,
  ]);

  return (
    <div className="container">
      <div className="flex flex-col gap-8 min-h-screen items-center justify-center bg-background/95 text-white rounded-2xl">
        <CircleCheckBig className="size-36 text-teal-600" />
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-[24px]">Payment Successful!</h2>
          <h2 className="text-sm">Transaction ID: {paymentID ?? "N/A"}</h2>
          <h2 className="text-sm">Order ID: {order?.documentId ?? "N/A"}</h2>
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
