/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
// import { encrypt } from "@/function/cryptoDecrypt";
import { ExternalLink } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type Props = {
  category: string;
  targetUrl: string;
  toolData: any[];
  toolId: string;
};

const OrderAccessButton = (props: Props) => {
  // const DECRYPT_PASS = process.env.DECRYPT_PASS ?? "";
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEncryptAndCopy = useCallback(async () => {
    // console.log(JSON.stringify(props?.toolData), "&&");
    setIsLoading(true);
    try {
      // const cookieToEncrypt = JSON.stringify(props?.toolData);
      // const encryptedCookies = encrypt(cookieToEncrypt, DECRYPT_PASS);

      await navigator.clipboard.writeText(props?.toolId);
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
  }, [props?.category, props?.targetUrl, props?.toolId]);

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleEncryptAndCopy}
      disabled={isLoading}
      className="w-full [background:linear-gradient(152deg,#FFF_-185.49%,#009E60.01%),#477BFF] h-12 rounded-full"
    >
      <ExternalLink className="h-4 w-4 mr-1" />
      Get Access
    </Button>
  );
};

export default OrderAccessButton;
