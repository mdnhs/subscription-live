"use client";

import { useOrderStore } from "@/_store/OrderStore";
import { ToolsResponse } from "@/_types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { encrypt } from "@/function/cryptoDecrypt";
import { ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const OrderSection = () => {
  const { data: session } = useSession();
  const { orders, loading, getOrderItems } = useOrderStore();
  const DECRYPT_PASS = process.env.DECRYPT_PASS ?? "";
  // const [cookies, setCookies] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // console.log(cookies, "&&");
  const handleEncryptAndCopy = useCallback(
    async (item: ToolsResponse) => {
      console.log(JSON.stringify(item.toolData), "&&");
      setIsLoading(true);
      try {
        const cookieToEncrypt = JSON.stringify(item.toolData);
        const encryptedCookies = encrypt(cookieToEncrypt, DECRYPT_PASS);
        // setCookies(encryptedCookies);

        await navigator.clipboard.writeText(encryptedCookies);
        toast.success(`Encrypted ${item.category} cookies copied!`, {
          description: "Successfully copied to clipboard",
        });
        window.open(item.targetUrl, "_blank");
      } catch (error) {
        toast.error(`Failed to encrypt ${item.category}`, {
          description: "Please try again or install our extension",
        });
        console.error("Encryption error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [DECRYPT_PASS, setIsLoading]
  );

  useEffect(() => {
    if (session?.user?.email) {
      getOrderItems(session.user.email);
    }
  }, [getOrderItems, session?.user?.email]);

  return (
    <div className="min-h-screen bg-background/95 p-4 md:p-8 rounded-2xl">
      <div className="">
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            My Orders
          </h1>
          <p className="text-muted-foreground mt-2">
            View and access your purchased products
          </p>
        </header>

        {loading ? (
          <OrdersLoading />
        ) : orders && orders.length > 0 ? (
          <ScrollArea className="h-[70vh]">
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            
            </div>
          </ScrollArea>
        ) : (
          <EmptyOrderState />
        )}
      </div>
    </div>
  );
};

const OrdersLoading = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-start">
              <Skeleton className="w-full sm:w-32 h-32" />
              <div className="p-4 flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const EmptyOrderState = () => {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">No orders yet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          When you purchase products, they will appear here.
        </p>
        <Button className="mt-4">Browse Products</Button>
      </div>
    </Card>
  );
};

export default OrderSection;
