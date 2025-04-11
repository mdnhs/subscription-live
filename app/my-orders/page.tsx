import OrderSection from "@/_components/myOrders/OrderSection";
import { getOrders } from "@/services/api/orderRequest";
import { fetchPublic } from "@/services/fetch/ssrfetchPublic";
import { auth } from "../auth";

export default async function Page() {
  // Fetch session using getServerSession
  const session = await auth();

  // Initialize orders
  let orders = [];

  // Fetch orders only if session exists
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

  // Log orders for debugging
  // console.log("Orders:", orders);

  return (
    <div className="container py-5">
      <OrderSection orders={orders} />
    </div>
  );
}
