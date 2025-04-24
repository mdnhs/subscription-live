import { ToolsResponse } from "@/_types/product";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getExpireDays,
  getFormattedExpireDate,
} from "@/function/dateFormatter";
import OrderAccessButton from "./OrderAccessButton";
import { Calendar, Hash, Info, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { toast } from "sonner";

// Helper function to calculate remaining time
const calculateRemainingTime = (expireDate: Date): string => {
  const now = new Date();
  const expiry = new Date(expireDate);

  // Calculate the difference in milliseconds
  const diffMs = expiry.getTime() - now.getTime();

  if (diffMs <= 0) return "Expired"; // Already expired

  // Convert milliseconds to days, hours, and minutes
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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
  documentId,
  id,
}) => {
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

  // Click to copy Tool ID
  const handleCopyId = async () => {
    if (id) {
      try {
        await navigator.clipboard.writeText(String(id));
        setIsCopied(true);
        toast.success(`Tool ID ${id} copied to clipboard!`);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error("Failed to copy:", err);
        toast("Failed to copy Tool ID.");
      }
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
                  ${isCopied ? "animate-pulse-once" : ""}
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
                {isCopied
                  ? "Copied!"
                  : `Click to copy Tool ID: ${id || "Not Available"}`}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6 text-gray-200">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-neon-blue" />
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
            <Clock className="w-5 h-5 text-neon-blue" />
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
            <OrderAccessButton
              category={category}
              targetUrl={targetUrl}
              toolData={toolData}
              toolId={documentId ?? ""}
            />
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