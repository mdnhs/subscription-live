"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Add this import
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import SubscriptionCard from "./SubscriptionCard";
import SubscriptionSkeletonCard from "./SubscriptionSkeletonCard";

interface CookieItem {
  _id: string;
  title: string;
  targetUrl: string;
  json: { name: string; value: string }[] | string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface HomeClientProps {
  readonly session: Session | null;
  readonly initialSubscriptions: readonly CookieItem[];
  readonly initialPagination?: Pagination;
}

export default function HomeClient({
  session,
  initialSubscriptions,
  initialPagination,
}: HomeClientProps) {
  const { data: clientSession, status } = useSession();
  const [cookies, setCookies] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subscriptions, setSubscriptions] = useState<CookieItem[]>([
    ...initialSubscriptions,
  ]);
  const [pagination, setPagination] = useState<Pagination | undefined>(
    initialPagination
  );

  const fetchSubscriptions = useCallback(
    async (page: number, limit: number) => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/subscriptions?page=${page}&limit=${limit}`
        );

        if (!res.ok) throw new Error("Failed to fetch subscriptions");

        const data: { data: CookieItem[]; pagination?: Pagination } =
          await res.json();
        setSubscriptions(data.data);
        if (data.pagination) setPagination(data.pagination);
      } catch (error) {
        toast.error("Failed to load subscriptions", {
          description: "Please try again later",
        });
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  //   const handleEncryptAndCopy = useCallback(
  //     async (item: CookieItem) => {
  //       setIsLoading(true);
  //       try {
  //         const cookieToEncrypt =
  //           typeof item.json === "string" ? item.json : JSON.stringify(item.json);
  //         const encryptedCookies = encrypt(cookieToEncrypt, DECRYPT_PASS);
  //         setCookies(encryptedCookies);

  //         await navigator.clipboard.writeText(encryptedCookies);
  //         toast.success(`Encrypted ${item.title} cookies copied!`, {
  //           description: "Successfully copied to clipboard",
  //         });
  //         window.open(item.targetUrl, "_blank");
  //       } catch (error) {
  //         toast.error(`Failed to encrypt ${item.title}`, {
  //           description: "Please try again or install our extension",
  //         });
  //         console.error("Encryption error:", error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     },
  //     [DECRYPT_PASS]
  //   );

  //   const handleDecryptAndCopy = useCallback(
  //     async (item: CookieItem) => {
  //       if (!cookies) {
  //         toast.error("No encrypted cookies", {
  //           description: "Please encrypt cookies first",
  //         });
  //         return;
  //       }

  //       setIsLoading(true);
  //       try {
  //         const decryptedCookies = decrypt(cookies, DECRYPT_PASS);
  //         await navigator.clipboard.writeText(decryptedCookies);
  //         toast.success(`Decrypted ${item.title} cookies copied!`, {
  //           description: "Successfully copied to clipboard",
  //         });
  //       } catch (error) {
  //         toast.error(`Failed to decrypt ${item.title}`, {
  //           description: "Invalid encryption key or corrupted data",
  //         });
  //         console.error("Decryption error:", error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     },
  //     [cookies, DECRYPT_PASS]
  //   );

  const currentSession = clientSession ?? session;
  const isAuthenticated = status === "authenticated";
  const isProduction = process.env.IS_PRODUCTION === "true";

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            {status === "loading" ? (
              <>
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto mt-2" />
              </>
            ) : (
              <>
                <CardTitle className="text-2xl text-center">
                  Welcome, {currentSession?.user?.name ?? "Guest"}!
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  {isAuthenticated
                    ? "This is your dashboard!"
                    : "Please sign up for power up with us!"}
                </p>
                {!isAuthenticated && (
                  <Link href="/register" className="flex justify-center mt-5">
                    <Button variant="outline">Signup</Button>
                  </Link>
                )}
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && subscriptions.length === 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index + "Array"}>
                    <SubscriptionSkeletonCard isProduction={isProduction} />
                  </div>
                ))}
              </div>
            ) : subscriptions.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No subscriptions available.
              </p>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {subscriptions.map((item, idx) => {
                    return (
                      <SubscriptionCard
                        key={idx + "subscriptions"}
                        item={item}
                        isLoading={isLoading}
                        isAuthenticated={isAuthenticated}
                        isProduction={isProduction}
                        cookies={cookies}
                        setCookies={setCookies}
                        setIsLoading={setIsLoading}
                      />
                    );
                  })}
                </div>
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      disabled={pagination.page <= 1 || isLoading}
                      onClick={() =>
                        fetchSubscriptions(
                          pagination.page - 1,
                          pagination.limit
                        )
                      }
                    >
                      Previous
                    </Button>
                    <span className="flex items-center">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={
                        pagination.page >= pagination.pages || isLoading
                      }
                      onClick={() =>
                        fetchSubscriptions(
                          pagination.page + 1,
                          pagination.limit
                        )
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
