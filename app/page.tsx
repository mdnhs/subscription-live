"use client";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { toast } from "sonner";
import { decrypt, encrypt } from "../function/cryptoDecrypt";
import CookiesData from "../public/json/cookies.json";

interface CookieItem {
  title: string;
  targetUrl: string;
  json: { name: string; value: string }[] | string;
}

export default function Home() {
  const DECRYPT_PASS = process.env.DECRYPT_PASS;
  const [cookies, setCookies] = useState("");

  // Function to handle encryption and copying for a specific cookie
  const handleEncryptAndCopy = (item: CookieItem) => {
    try {
      // Prepare the cookie data
      const cookieToEncrypt =
        typeof item.json === "string" ? item.json : JSON.stringify(item.json);

      // Encrypt the cookies
      const encryptedCookies = encrypt(cookieToEncrypt, DECRYPT_PASS!);
      setCookies(encryptedCookies);

      // Convert to string if needed
      const cookiesToCopy =
        typeof encryptedCookies === "string"
          ? encryptedCookies
          : JSON.stringify(encryptedCookies, null, 2);

      // Copy to clipboard
      navigator.clipboard
        .writeText(cookiesToCopy)
        .then(() => {
          // Show success toast
          toast.success(`Encrypted ${item.title} cookies copied!`, {
            description: "The encrypted cookies are now in your clipboard.",
          });
          window.open(item.targetUrl, "_blank");
        })
        .catch((err) => {
          // Show error toast if copy fails
          toast.error(`Failed to copy ${item.title} cookies`, {
            description: "Please try again or copy manually.",
          });
          console.error("Copy failed", err);
        });
    } catch (error) {
      // Handle encryption errors
      toast.error(`Access failed for ${item.title}`, {
        description: "Please install our extension",
      });
      console.error("Encryption error", error);
    }
  };

  // Function to handle decryption and copying for a specific cookie
  const handleDecryptAndCopy = (item: CookieItem) => {
    try {
      // Prepare the cookie data
      const cookieToDecrypt = cookies;

      // Decrypt the cookies
      const decryptedCookies = decrypt(cookieToDecrypt, DECRYPT_PASS!);

      // Convert to string if needed
      const cookiesToCopy =
        typeof decryptedCookies === "string"
          ? decryptedCookies
          : JSON.stringify(decryptedCookies, null, 2);

      // Copy to clipboard
      navigator.clipboard
        .writeText(cookiesToCopy)
        .then(() => {
          // Show success toast
          toast.success(`Decrypted ${item.title} cookies copied!`, {
            description: "The decrypted cookies are now in your clipboard.",
          });
        })
        .catch((err) => {
          // Show error toast if copy fails
          toast.error(`Failed to copy ${item.title} cookies`, {
            description: "Please try again or copy manually.",
          });
          console.error("Copy failed", err);
        });
    } catch (error) {
      // Handle decryption errors
      toast.error(`Decryption failed for ${item.title}`, {
        description: "Unable to decrypt the cookies. Check the encryption key.",
      });
      console.error("Decryption error", error);
    }
  };

  return (
    <div>
      <div className="container mx-auto py-5">
        <div className="h-20 w-full flex items-center justify-between border rounded-full p-5 shadow-2xs">
          <div>Logo</div>
          <ModeToggle />
        </div>

        <div className="py-5 flex flex-col justify-center items-center">
          <div className="flex flex-col gap-2 mt-4">
            {CookiesData.map((item: CookieItem, idx: number) => (
              <div key={idx + "CookiesData"} className="flex gap-2">
                <Button
                  onClick={() => handleEncryptAndCopy(item)}
                  variant="default"
                >
                  {item.title}
                </Button>
                {process.env.IS_PRODUCTION === "false" && (
                  <Button
                    onClick={() => handleDecryptAndCopy(item)}
                    variant="outline"
                  >
                    Decrypt {item.title}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
