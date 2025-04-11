"use client";
import { Button } from "@/components/ui/button";
import { encrypt } from "@/function/cryptoDecrypt";
import { ExternalLink } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { category: string; targetUrl: string; toolData: any[] };

const OrderAccessButton = (props: Props) => {
  const DECRYPT_PASS = process.env.DECRYPT_PASS ?? "";
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEncryptAndCopy = useCallback(async () => {
    console.log(JSON.stringify(props?.toolData), "&&");
    setIsLoading(true);
    try {
      const cookieToEncrypt = JSON.stringify(props?.toolData);
      const encryptedCookies = encrypt(cookieToEncrypt, DECRYPT_PASS);

      await navigator.clipboard.writeText(encryptedCookies);
      toast.success(`Encrypted ${props?.category} cookies copied!`, {
        description: "Successfully copied to clipboard",
      });
      window.open(props?.targetUrl, "_blank");
    } catch (error) {
      toast.error(`Failed to encrypt ${props?.category}`, {
        description: "Please try again or install our extension",
      });
      console.error("Encryption error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [DECRYPT_PASS, props?.category, props?.toolData, props?.targetUrl]);

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleEncryptAndCopy}
      disabled={isLoading}
      className="mt-2 sm:mt-0 w-full sm:w-auto"
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      Get Access
    </Button>
  );
};

export default OrderAccessButton;
