"use client";

import { useOrderStore } from "@/_store/OrderStore";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";
import { encrypt } from "@/function/cryptoDecrypt";
import { Product } from "@/_types/product";

const OrderSection = () => {
  const { data: session } = useSession();
  const { orders, loading, getOrderItems } = useOrderStore();
  const DECRYPT_PASS = process.env.DECRYPT_PASS ?? "";
  const [cookies, setCookies] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(cookies, "&&");
  const handleEncryptAndCopy = useCallback(
    async (item: Product) => {
      console.log(JSON.stringify(item.getAccessData), "&&");
      setIsLoading(true);
      try {
        const cookieToEncrypt = JSON.stringify(item.getAccessData);
        const encryptedCookies = encrypt(cookieToEncrypt, DECRYPT_PASS);
        setCookies(encryptedCookies);

        await navigator.clipboard.writeText(encryptedCookies);
        toast.success(`Encrypted ${item.title} cookies copied!`, {
          description: "Successfully copied to clipboard",
        });
        window.open(item.targetUrl, "_blank");
      } catch (error) {
        toast.error(`Failed to encrypt ${item.title}`, {
          description: "Please try again or install our extension",
        });
        console.error("Encryption error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [DECRYPT_PASS, setCookies, setIsLoading]
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
              {orders?.map((item, idx) => {
                console.log(item);
                return (
                  <Card
                    key={idx + "orders"}
                    className="overflow-hidden py-0 h-fit"
                  >
                    <CardContent className="p-0 dark:bg-teal-700">
                      <div className=" items-start">
                        {item?.products[0]?.banner?.url && (
                          <div className="w-full h-32 relative">
                            <Image
                              src={item?.products[0]?.banner?.url}
                              alt={item?.products[0]?.title || "Product image"}
                              fill
                              className="object-cover "
                            />
                          </div>
                        )}

                        <div className="p-4 flex-1 ">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-medium line-clamp-1">
                                {item?.products[0]?.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="capitalize">
                                  {item?.products[0]?.category}
                                </Badge>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleEncryptAndCopy(item?.products[0])
                              }
                              disabled={isLoading}
                              className="mt-2 sm:mt-0 w-full sm:w-auto"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Get Access
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
