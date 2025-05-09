import { ToolsResponse } from "@/_types/product";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getExpireDays,
  getFormattedExpireDate,
} from "@/function/dateFormatter";
import OrderAccessButton from "./OrderAccessButton";
import {
  Calendar,
  Hash,
  Info,
  Clock,
  Mail,
  LockKeyholeOpen,
  User,
  Key,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { toast } from "sonner";
import { decrypt } from "@/function/cryptoDecrypt";

// Helper function to calculate remaining time
const calculateRemainingTime = (expireDate: Date): string => {
  const now = new Date();
  const expiry = new Date(expireDate);

  // Calculate the difference in milliseconds
  const diffMs = expiry.getTime() - now.getTime();

  if (diffMs <= 0) return "Expired"; // Already expired

  // Convert milliseconds to days, hours, and minutes
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffDays}d ${diffHours}h ${diffMinutes}m`;
};

const OrderCard: React.FC<ToolsResponse> = ({
  category,
  month,
  toolData,
  targetUrl,
  expireDate,
  isActive,
  isMobile,
  documentId,
  id,
  email,
  password,
  pin,
  profile,
}) => {
  const encryptionKey =process.env.DECRYPT_PASS;
  const daysUntilExpiry = getExpireDays(month);
  const expireDateTime = new Date(expireDate ?? new Date());
  const formattedExpiryDate = getFormattedExpireDate(
    expireDate ?? new Date().toISOString()
  );
  const formattedExpiryTime = expireDateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const isExpiringSoon =
    Number(daysUntilExpiry) <= 7 && Number(daysUntilExpiry) > 0;
  const isExpired = Number(daysUntilExpiry) <= 0;

  // Calculate remaining time
  const remainingTime = calculateRemainingTime(expireDateTime);

  // State for copy feedback
  const [isCopied, setIsCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Click to copy Tool ID
  const handleCopyId = async () => {
    if (id) {
      try {
        await navigator.clipboard.writeText(String(id));
        setIsCopied(true);
        setCopiedField("id");
        toast.success(`Tool ID ${id} copied to clipboard!`);
        setTimeout(() => {
          setIsCopied(false);
          setCopiedField(null);
        }, 2000); // Reset after 2 seconds
      } catch (err) {
        console.error("Failed to copy:", err);
        toast("Failed to copy Tool ID.");
      }
    }
  };

  // Generic copy handler for email, password, and pin
  const handleCopy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => {
        setIsCopied(false);
        setCopiedField(null);
      }, 2000); // Reset after 2 seconds
    } catch (err) {
      console.error(`Failed to copy ${field}:`, err);
      toast(`Failed to copy ${field}.`);
    }
  };

  return (
    <Card
      className={`
        overflow-hidden 
        transition-all duration-500 
        max-w-md mx-auto 
        border-2 border-neon 
        bg-gradient-to-br from-gray-900/90 to-gray-800/90 
        dark:from-gray-950/90 dark:to-gray-900/90 
        backdrop-blur-md 
        rounded-xl p-0`}
      role="region"
      aria-labelledby={`order-card-${id}`}
    >
      <CardHeader className="bg-gradient-to-r from-neon-blue/50 to-neon-purple/50 pb-2 border-b-2 border-neon-blue/30">
        <div className="flex justify-between items-center pt-4">
          <CardTitle
            id={`order-card-${id}`}
            className="text-lg font-bold capitalize neon-text-blue truncate tracking-wide"
          >
            {category || "Uncategorized"}
          </CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className={`
                  text-xs font-medium 
                  bg-neon-blue/50 
                  hover:bg-neon-blue/70 
                  text-white 
                  neon-border-blue 
                  transition-all duration-300 
                  cursor-pointer 
                  animate-in fade-in
                  ${
                    isCopied && copiedField === "id" ? "animate-pulse-once" : ""
                  }
                `}
                onClick={handleCopyId}
                role="button"
                aria-label={`Copy Tool ID ${id || "N/A"}`}
              >
                <Hash className="w-3 h-3 mr-1" />
                {id || "N/A"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className=" border-neon-blue">
              <p>
                {isCopied && copiedField === "id"
                  ? "Copied!"
                  : `Click to copy Tool ID: ${id || "Not Available"}`}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6 text-gray-200">
        <div className="flex flex-col gap-3">
          {isMobile && (
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Mail className="min-w-5 h-5 text-neon-blue" />
                <span className={`text-sm digital-font`}>
                  {decrypt(email || "", encryptionKey)}
                </span>
              </div>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`
                      p-1 rounded cursor-pointer hover:bg-neon-blue/20 transition-colors
                      ${
                        isCopied && copiedField === "email"
                          ? "animate-pulse-once"
                          : ""
                      }
                    `}
                      onClick={() =>
                        handleCopy(decrypt(email || "", encryptionKey), "email")
                      }
                      aria-label="Copy email"
                    >
                      <Copy className="w-4 h-4 text-neon-blue" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="border-neon-blue">
                    <p>
                      {isCopied && copiedField === "email"
                        ? "Copied!"
                        : "Copy email"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
          {isMobile && (
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <LockKeyholeOpen className="min-w-5 h-5 text-neon-blue" />
                <span className={`text-sm digital-font`}>
                  {showPassword
                    ? decrypt(password || "", encryptionKey)
                    : "••••••••"}
                </span>
              </div>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-1 cursor-pointer rounded hover:bg-neon-blue/20 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-neon-blue" />
                      ) : (
                        <Eye className="w-4 h-4 text-neon-blue" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="border-neon-blue">
                    <p>{showPassword ? "Hide password" : "Show password"}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`
                      p-1 rounded cursor-pointer hover:bg-neon-blue/20 transition-colors
                      ${
                        isCopied && copiedField === "password"
                          ? "animate-pulse-once"
                          : ""
                      }
                    `}
                      onClick={() =>
                        handleCopy(
                          decrypt(password || "", encryptionKey),
                          "password"
                        )
                      }
                      aria-label="Copy password"
                    >
                      <Copy className="w-4 h-4 text-neon-blue" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="border-neon-blue">
                    <p>
                      {isCopied && copiedField === "password"
                        ? "Copied!"
                        : "Copy password"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
          {pin && (
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Key className="min-w-5 h-5 text-neon-blue" />
                <span className={`text-sm digital-font`}>
                  {showPin ? pin : "••••"}
                </span>
              </div>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-1 rounded hover:bg-neon-blue/20 transition-colors cursor-pointer"
                      onClick={() => setShowPin(!showPin)}
                      aria-label={showPin ? "Hide pin" : "Show pin"}
                    >
                      {showPin ? (
                        <EyeOff className="w-4 h-4 text-neon-blue" />
                      ) : (
                        <Eye className="w-4 h-4 text-neon-blue" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="border-neon-blue">
                    <p>{showPin ? "Hide pin" : "Show pin"}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`
                      p-1 rounded hover:bg-neon-blue/20 cursor-pointer transition-colors
                      ${
                        isCopied && copiedField === "pin"
                          ? "animate-pulse-once"
                          : ""
                      }
                    `}
                      onClick={() => handleCopy(pin, "pin")}
                      aria-label="Copy pin"
                    >
                      <Copy className="w-4 h-4 text-neon-blue" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="border-neon-blue">
                    <p>
                      {isCopied && copiedField === "pin"
                        ? "Copied!"
                        : "Copy pin"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
          {profile && (
            <div className="flex items-center gap-2">
              <User className="min-w-5 h-5 text-neon-blue" />
              <span className={`text-sm digital-font`}>{profile}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="min-w-5 h-5 text-neon-blue" />
            <span
              className={`text-sm ${
                isExpiringSoon
                  ? "neon-amber"
                  : isExpired
                  ? "neon-red"
                  : "neon-green"
              } digital-font`}
            >
              {formattedExpiryDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="min-w-5 h-5 text-neon-blue" />
            <span
              className={`text-sm ${
                isExpiringSoon
                  ? "neon-amber"
                  : isExpired
                  ? "neon-red"
                  : "neon-green"
              } digital-font`}
            >
              {formattedExpiryTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-200">
              Remaining:
            </span>
            <span
              className={`text-sm ${
                isExpiringSoon
                  ? "neon-amber"
                  : isExpired
                  ? "neon-red"
                  : "neon-green"
              } ${
                isExpiringSoon || isExpired ? "font-bold animate-blink" : ""
              } digital-font`}
            >
              {remainingTime}
            </span>
            {(isExpiringSoon || isExpired) && (
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-neon-blue" />
                </TooltipTrigger>
                <TooltipContent className=" border-neon-blue">
                  <p>
                    {isExpired
                      ? "Your subscription has expired!"
                      : "Your subscription is expiring soon!"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="pt-2 space-y-4">
          {isActive && !isExpired ? (
            <div>
              {!isMobile && (
                <OrderAccessButton
                  category={category}
                  targetUrl={targetUrl}
                  toolData={toolData}
                  toolId={documentId ?? ""}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-neon-gray digital-font">
                {isExpired
                  ? "Your subscription has expired. Renew to regain access."
                  : "Contact support to renew or activate your access."}
              </p>
              <a
                href="/support"
                className="text-sm text-neon-blue hover:text-neon-blue/70 digital-font transition-colors"
              >
                Contact Support
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
