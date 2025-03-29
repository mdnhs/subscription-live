import React, { useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { BadgeDollarSign, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import { decrypt, encrypt } from "@/function/cryptoDecrypt";
import { toast } from "sonner";

interface CookieItem {
  _id: string;
  title: string;
  targetUrl: string;
  json: { name: string; value: string }[] | string;
}

interface Props {
  item: CookieItem;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProduction: boolean;
  cookies?: string;
  setCookies: (cookies: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const SubscriptionCard = ({
  item,
  isLoading,
  isAuthenticated,
  isProduction,
  cookies,
  setCookies,
  setIsLoading,
}: Props) => {
  const DECRYPT_PASS = process.env.DECRYPT_PASS ?? "";

  const handleEncryptAndCopy = useCallback(
    async (item: CookieItem) => {
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
    },
    [DECRYPT_PASS, setCookies, setIsLoading]
  );

  const handleDecryptAndCopy = useCallback(
    async (item: CookieItem) => {
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
    },
    [cookies, DECRYPT_PASS, setIsLoading]
  );

  return (
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
            <Link href="/login">
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
};

export default SubscriptionCard;
