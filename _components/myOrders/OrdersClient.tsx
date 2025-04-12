// _components/myOrders/OrdersClient.jsx
"use client";

import { getOrders } from "@/services/api/orderRequest";
import { fetchPublic } from "@/services/fetch/ssrFetch";
import { useEffect, useState } from "react";
import OrderSection from "./OrderSection"; // Adjust path if needed
import Skeleton from "./Skeleton"; // Adjust path if needed

interface OrdersClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialOrders: any; // Replace 'any[]' with the specific type if known
  email: string | null | undefined;
}

export default function OrdersClient({
  initialOrders,
  email,
}: OrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [isLoading, setIsLoading] = useState(true);

  // Handle initial skeleton and API refetch
  useEffect(() => {
    // Show skeleton for at least 1 second
    setIsLoading(true);

    const timer = setTimeout(async () => {
      if (email) {
        try {
          // Refetch orders after 1 second
          const req = getOrders(email);
          const res = await fetchPublic(req);
          setOrders(res?.data ?? []);
        } catch (error) {
          console.error("Error refetching orders:", error);
        }
      }
      setIsLoading(false);
    }, 10);

    return () => clearTimeout(timer);
  }, [email]); // Re-run if email changes

  if (isLoading) {
    return <Skeleton />;
  }
console.log(orders,"++%");
  return <OrderSection orders={orders} />;
}
