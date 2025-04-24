import { getOrders } from "@/services/api/orderRequest";
import { getCurrentUser } from "@/services/api/userRequest";
import { fetchPublic } from "@/services/fetch/ssrFetch";
import { auth } from "../auth";
import AccountClient from "@/_components/myAccount/AccountClient";

export default async function ProfilePageWrapper() {
  const session = await auth();
  const jwt = (session?.user as { jwt?: string })?.jwt;
  const userEmail = session?.user?.email;

  const defaultUser = {
    id: 0,
    username: "",
    email: "",
    fullName: "",
  };

  let currentUser = defaultUser;
  let orders = [];

  if (userEmail && jwt) {
    try {
      const [userData, ordersData] = await Promise.all([
        fetchPublic(getCurrentUser(jwt)).catch(() => null),
        fetchPublic(getOrders(userEmail)).catch(() => ({ data: [] })),
      ]);

      currentUser = userData || defaultUser;
      orders = ordersData?.data || [];
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  return <AccountClient userData={currentUser} ordersData={orders} />;
}
