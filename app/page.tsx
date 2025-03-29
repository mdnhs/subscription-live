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
import { BadgeDollarSign, Lock, Unlock } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { decrypt, encrypt } from "../function/cryptoDecrypt";

interface CookieItem {
  _id: string;
  title: string;
  targetUrl: string;
  json: { name: string; value: string }[] | string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [cookies, setCookies] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<CookieItem[]>([]);
  const DECRYPT_PASS = process.env.DECRYPT_PASS;

  useEffect(() => {
    if (status === "authenticated") {
      fetchSubscriptions();
    }
  }, [status]);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/subscriptions");
      if (!res.ok) throw new Error("Failed to fetch subscriptions");

      const data = await res.json();
      setSubscriptions(data.data);
    } catch (error) {
      toast.error("Failed to load subscriptions", {
        description: "Please try again later",
      });
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEncryptAndCopy = async (item: CookieItem) => {
    setIsLoading(true);
    try {
      const cookieToEncrypt =
        typeof item.json === "string" ? item.json : JSON.stringify(item.json);

      const encryptedCookies = encrypt(cookieToEncrypt, DECRYPT_PASS!);
      setCookies(encryptedCookies);

      const cookiesToCopy =
        typeof encryptedCookies === "string"
          ? encryptedCookies
          : JSON.stringify(encryptedCookies);

      await navigator.clipboard.writeText(cookiesToCopy);
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
  };

  const handleDecryptAndCopy = async (item: CookieItem) => {
    if (!cookies) {
      toast.error("No encrypted cookies", {
        description: "Please encrypt cookies first",
      });
      return;
    }

    setIsLoading(true);
    try {
      const decryptedCookies = decrypt(cookies, DECRYPT_PASS!);
      const cookiesToCopy =
        typeof decryptedCookies === "string"
          ? decryptedCookies
          : JSON.stringify(decryptedCookies);

      await navigator.clipboard.writeText(cookiesToCopy);
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
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Welcome, {session?.user?.name ?? "Guest"}!
            </CardTitle>
            <p className="text-center text-muted-foreground">
              {status === "authenticated"
                ? "This is your dashboard!"
                : "Please sign up for power up with us!"}
            </p>
            {status === "unauthenticated" && (
              <Link href={"/register"} className="flex justify-center mt-5">
                <Button variant={"outline"}>Signup</Button>
              </Link>
            )}
          </CardHeader>

          {status === "authenticated" ? (
            <CardContent className="space-y-6">
              {isLoading && subscriptions.length === 0 ? (
                <p className="text-center">Loading subscriptions...</p>
              ) : subscriptions.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No subscriptions available.
                </p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {subscriptions.map((item) => (
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
                          <Button
                            onClick={() => handleEncryptAndCopy(item)}
                            disabled={isLoading}
                            className="w-full"
                          >
                            <Unlock className="mr-2 h-4 w-4" />
                            {isLoading ? "Processing..." : "Unlock Premium"}
                          </Button>
                          {process.env.IS_PRODUCTION !== "true" && (
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
                  ))}
                </div>
              )}
            </CardContent>
          ) : (
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {subscriptions.map((item) => (
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
                        <Link href={"/register"}>
                          <Button disabled={isLoading} className="w-full">
                            <BadgeDollarSign className="mr-2 h-4 w-4" />
                            {"Buy Premium"}
                          </Button>
                        </Link>
                        {process.env.IS_PRODUCTION !== "true" && (
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
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}