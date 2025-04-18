import OrdersClient from "@/_components/myOrders/OrdersClient";
import ProfileSection from "@/_components/profile/ProfileSection";
import { User } from "@/_types/usersTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrders } from "@/services/api/orderRequest";
import { getCurrentUser } from "@/services/api/userRequest";
import { fetchPublic } from "@/services/fetch/ssrFetch";
import { Loader2, LogOut, ShoppingBag, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "../auth";
import SignOut from "@/components/auth/SignOut";

interface TabConfig {
  value: string;
  label: string;
  icon: React.ReactNode;
}

// Define the correct type for your page props
interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

const tabsConfig: TabConfig[] = [
  {
    value: "profile",
    label: "Profile",
    icon: <UserIcon className="w-4 h-4 mr-2" />,
  },
  {
    value: "my-orders",
    label: "My Orders",
    icon: <ShoppingBag className="w-4 h-4 mr-2" />,
  },
  {
    value: "signout",
    label: "Sign Out",
    icon: <LogOut className="w-4 h-4 mr-2" />,
  },
];

export default async function ProfilePage({ searchParams }: PageProps) {
  // Await the searchParams promise
  const params = await searchParams;
  const tabFromQuery = params?.tab;

  const session = await auth();
  const jwt = (session?.user as { jwt?: string })?.jwt;
  const userEmail = session?.user?.email;

  // Get the active tab from URL or default to "profile"
  const activeTab = tabFromQuery && tabsConfig.some((tab) => tab.value === tabFromQuery)
    ? tabFromQuery
    : "profile";

  // Initialize data
  const defaultUser: User = {
    id: 0,
    username: "",
    email: "",
    fullName: "",
  };

  let currentUser = defaultUser;
  let orders = [];

  // Fetch user data only if logged in
  if (userEmail && jwt) {
    try {
      // Fetch user and orders data in parallel
      const [userData, ordersData] = await Promise.all([
        fetchPublic(getCurrentUser(jwt)).catch(() => null),
        fetchPublic(getOrders(userEmail)).catch(() => ({ data: [] })),
      ]);

      currentUser = userData || defaultUser;
      orders = ordersData?.data || [];
    } catch (error) {
      console.error("Error fetching profile data:", error);
      // Continue with default values
    }
  }

  const LoadingFallback = () => (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="w-8 h-8 animate-spin text-brand-1" />
      <span className="ml-2 text-lg font-medium">Loading...</span>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container pt-24 pb-12 md:pt-28 md:pb-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My Account</h1>

        <Tabs
          value={activeTab}
          defaultValue={activeTab}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6"
        >
          <TabsList className="flex md:flex-col col-span-1 w-full space-y-0 md:space-y-2 space-x-2 md:space-x-0 bg-brand-1/[3%] border rounded-xl md:rounded-2xl border-gray-50/20 p-2 md:p-3 backdrop-blur-sm h-fit sticky top-24 overflow-hidden justify-start items-start">
            {tabsConfig.map((tab) => (
              <Link
                key={tab.value}
                href={`/my-account?tab=${tab.value}`}
                className="w-full"
              >
                <TabsTrigger
                  value={tab.value}
                  className="flex items-center justify-center md:justify-start w-full px-4 py-3 transition-all duration-200 hover:bg-brand-1/10"
                >
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>

          <div className="col-span-1 md:col-span-4 bg-gray-50/5 border border-gray-50/10 rounded-xl p-4 md:p-6">
            <Suspense fallback={<LoadingFallback />}>
              <TabsContent value="profile" className="mt-0">
                <div className="flex items-center mb-4">
                  <UserIcon className="w-5 h-5 mr-2 text-brand-1" />
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                </div>
                <ProfileSection user={currentUser} />
              </TabsContent>

              <TabsContent value="my-orders" className="mt-0">
                <div className="flex items-center mb-4">
                  <ShoppingBag className="w-5 h-5 mr-2 text-brand-1" />
                  <h2 className="text-xl font-semibold">Order History</h2>
                </div>
                <OrdersClient
                  initialOrders={orders}
                  email={userEmail}
                  key={`orders-${orders.length}`}
                />
              </TabsContent>

              <TabsContent value="signout" className="mt-0">
                <SignOut />
              </TabsContent>
            </Suspense>
          </div>
        </Tabs>
      </div>
    </div>
  );
}