"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Add this import
import { BadgeDollarSign, Lock, Unlock } from "lucide-react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Link from "next/link";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { decrypt, encrypt } from "../../function/cryptoDecrypt";

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
  const DECRYPT_PASS = process.env.DECRYPT_PASS ?? "";

  const fetchSubscriptions = useCallback(async (page: number, limit: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/subscriptions?page=${page}&limit=${limit}`);
      
      if (!res.ok) throw new Error("Failed to fetch subscriptions");

      const data: { data: CookieItem[]; pagination?: Pagination } = await res.json();
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
  }, []);

  const handleEncryptAndCopy = useCallback(async (item: CookieItem) => {
    setIsLoading(true);
    try {
      const cookieToEncrypt =
        typeof item.json === "string" ? item.json : JSON.stringify(item.json);
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
  }, [DECRYPT_PASS]);

  const handleDecryptAndCopy = useCallback(async (item: CookieItem) => {
    if (!cookies) {
      toast.error("No encrypted cookies", {
        description: "Please encrypt cookies first",
      });
      return;
    }

    setIsLoading(true);
    try {
      const decryptedCookies = decrypt(cookies, DECRYPT_PASS);
      await navigator.clipboard.writeText(decryptedCookies);
      toast.success(`Decrypted ${item.title} cookies copied!`, {
        description: "Successfully copied to clipboard",
      });
    } catch (error) {
      toast.error(`Failed to decrypt ${item.title}`, {
        description: "Invalid encryption key or corrupted data",
      });
      console.error("Decryption error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cookies, DECRYPT_PASS]);

  const currentSession = clientSession ?? session;
  const isAuthenticated = status === "authenticated";
  const isProduction = process.env.IS_PRODUCTION === "true";

  const renderSkeletonCard = () => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          {!isProduction && <Skeleton className="h-10 w-full" />}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-36" />
      </CardFooter>
    </Card>
  );

  const renderSubscriptionCard = (item: CookieItem) => (
    <Card
      key={item._id}
      className="hover:shadow-lg transition-shadow duration-200"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{item.title}</span>
        </CardTitle>
        <CardDescription>
          Get access for {item.title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {isAuthenticated ? (
            <Button
              onClick={() => handleEncryptAndCopy(item)}
              disabled={isLoading}
              className="w-full"
            >
              <Unlock className="mr-2 h-4 w-4" />
              {isLoading ? "Processing..." : "Unlock Premium"}
            </Button>
          ) : (
            <Link href="/register">
              <Button disabled={isLoading} className="w-full">
                <BadgeDollarSign className="mr-2 h-4 w-4" />
                Buy Premium
              </Button>
            </Link>
          )}
          {!isProduction && (
            <Button
              onClick={() => handleDecryptAndCopy(item)}
              variant="outline"
              disabled={isLoading || !cookies}
              className="w-full"
            >
              <Lock className="mr-2 h-4 w-4" />
              {isLoading ? "Processing..." : "Decrypt & Copy"}
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>Website URL: {item.targetUrl.split("//")[1]}</p>
      </CardFooter>
    </Card>
  );

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
                  <div key={index}>{renderSkeletonCard()}</div>
                ))}
              </div>
            ) : subscriptions.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No subscriptions available.
              </p>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {subscriptions.map(renderSubscriptionCard)}
                </div>
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      disabled={pagination.page <= 1 || isLoading}
                      onClick={() =>
                        fetchSubscriptions(pagination.page - 1, pagination.limit)
                      }
                    >
                      Previous
                    </Button>
                    <span className="flex items-center">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={pagination.page >= pagination.pages || isLoading}
                      onClick={() =>
                        fetchSubscriptions(pagination.page + 1, pagination.limit)
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