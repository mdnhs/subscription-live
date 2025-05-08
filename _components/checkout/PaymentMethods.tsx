import { siteConfig } from "@/app/site";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface PaymentMethodsProps {
  selectedPayment: string;
  setSelectedPayment: (method: string) => void;
  handleBkashPayment: () => Promise<void>;
  isProcessing: boolean;
  isFree?: boolean;
  total: number;
  showSupportMessage: boolean;
}

const PaymentMethods = ({
  selectedPayment,
  setSelectedPayment,
  handleBkashPayment,
  isProcessing,
  isFree,
  total,
  showSupportMessage,
}: PaymentMethodsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(showSupportMessage);

  useEffect(() => {
    setIsDialogOpen(showSupportMessage);
  }, [showSupportMessage]);
  console.log(isFree, "isFree");

  return (
    <div className="mt-6">
      {!isFree && <h2 className="text-lg font-medium mb-4">Payment Method</h2>}
      {!isFree && (
        <div className="grid grid-cols-2 gap-4">
          {siteConfig?.paymentMethods?.map(({ id, name, icon }) => (
            <button
              key={id}
              onClick={() => setSelectedPayment(id)}
              className={`p-4 border rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                selectedPayment === id
                  ? "border-brand-1 bg-brand-1/10"
                  : "border-gray-200 hover:border-brand-1"
              }`}
            >
              <span className="text-2xl">{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}

      {total > 0 && !showSupportMessage && (
        <div className="mt-6">
          {selectedPayment === "bkash" && (
            <Button
              onClick={handleBkashPayment}
              disabled={isProcessing}
              className="[background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF] rounded-full text-lg font-semibold text-white h-12 px-6"
            >
              {isProcessing
                ? "Processing..."
                : isFree
                ? "Claim Free"
                : "Pay with bKash"}
            </Button>
          )}
          {selectedPayment === "nagad" && (
            <div className="p-4 bg-gray-100 rounded text-black">
              <p>Nagad integration coming soon</p>
            </div>
          )}
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support Team</DialogTitle>
            <DialogDescription>
              We&apos;re here to help! If you&apos;re experiencing issues with
              your payment or have any questions, please reach out to our
              support team.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="mr-2"
            >
              Close
            </Button>
            <Button asChild>
              <a href="mailto:upeasybd@gmail.com">Contact Support</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethods;
