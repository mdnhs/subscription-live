// app/orders/page.jsx
import { getOrders } from "@/services/api/orderRequest";
import { fetchPublic } from "@/services/fetch/ssrFetch";
import { auth } from "../auth";
import OrdersClient from "@/_components/myOrders/OrdersClient";

export default async function Page() {
  const session = await auth();
  let orders = [];

  if (session?.user?.email) {
    try {
      const req = getOrders(session.user.email);
      const res = await fetchPublic(req);
      orders = res?.data ?? [];
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  } else {
    console.log("No session found, user may need to log in.");
  }

  return (
    <div className="container py-5">
      {/* Pass orders and email, use key to force remount on navigation */}
      <OrdersClient
        initialOrders={orders}
        email={session?.user?.email}
        key={Date.now()}
      />
    </div>
  );
}