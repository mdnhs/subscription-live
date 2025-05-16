"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, LogOut, ShoppingBag, User as UserIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersClient from "@/_components/myOrders/OrdersClient";
import ProfileSection from "@/_components/profile/ProfileSection";
import SignOut from "@/components/auth/SignOut";
import { User } from "@/_types/usersTypes";
import { OrderResponse } from "@/_types/ordersTypes";
import ExtensionButton from "../extension/ExtensionButton";
import WatchTutorial from "../tutorial/WatchTutorial";

interface TabConfig {
  value: string;
  label: string;
  icon: React.ReactNode;
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

export default function AccountClient({
  userData,
  ordersData,
}: {
  userData: User;
  ordersData: OrderResponse[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tabsConfig.some((t) => t.value === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);
    router.replace(`/my-account?tab=${value}`, { scroll: false });
    // Small timeout to ensure smooth transition
    setTimeout(() => setIsLoading(false), 50);
  };

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
          onValueChange={handleTabChange}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6"
        >
          <TabsList className="flex md:flex-col col-span-1 w-full space-y-0 md:space-y-2 space-x-2 md:space-x-0 bg-brand-1/[3%] border rounded-xl md:rounded-2xl border-gray-50/20 p-2 md:p-3 backdrop-blur-sm h-fit sticky top-24 overflow-hidden justify-start items-start">
            {tabsConfig.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center justify-center md:justify-start w-full px-4 py-3 transition-all duration-200 hover:bg-brand-1/10"
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="col-span-1 md:col-span-4 bg-gray-50/5 border border-gray-50/10 rounded-xl p-4 md:p-6">
            {isLoading ? (
              <LoadingFallback />
            ) : (
              <>
                <TabsContent value="profile" className="mt-0">
                  <div className="flex items-center mb-4">
                    <UserIcon className="w-5 h-5 mr-2 text-brand-1" />
                    <h2 className="text-xl font-semibold">
                      Profile Information
                    </h2>
                  </div>
                  <ProfileSection user={userData} />
                </TabsContent>

                <TabsContent value="my-orders" className="mt-0">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-2 text-brand-1" />
                      <h2 className="text-xl font-semibold">Order History</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <WatchTutorial />
                      <ExtensionButton />
                    </div>
                  </div>
                  <OrdersClient
                    initialOrders={ordersData}
                    email={userData?.email}
                    key={`orders-${ordersData.length}`}
                  />
                </TabsContent>

                <TabsContent value="signout" className="mt-0">
                  <SignOut />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
