import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Confetti from "react-confetti";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";

const SuccessDialog = ({
  isDialogOpen,
  registeredUsername,
  isCopied,
  handleCopyUsername,
  handleCloseDialog,
}: {
  isDialogOpen: boolean;
  registeredUsername: string;
  isCopied: boolean;
  handleCopyUsername: () => void;
  handleCloseDialog: () => void;
}) => {
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => !open && handleCloseDialog()}
    >
      <DialogContent className="sm:max-w-xl">
        {isDialogOpen && (
          <Confetti
            recycle={true}
            numberOfPieces={200}
            className="w-full h-full"
          />
        )}
        <DialogHeader>
          <DialogTitle className="font-bruno text-xl md:text-3xl bg-gradient-to-t from-brand-1 via-brand-1 to-white bg-clip-text text-transparent">
            Congratulations!
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <p className="text-muted-foreground">
            Hi {registeredUsername}, <br /> <br />
            Welcome aboard! 🎉 <br /> We‘re thrilled to have you join the{" "}
            <span className="font-semibold">UpEasy</span> community. <br />{" "}
            <br /> Your account is all set up and ready to go. You‘re now one
            step closer to accessing a curated suite of powerful AI tools
            designed to help you innovate, create, and achieve more. <br />{" "}
            <br /> Dive in and start exploring what‘s possible! <br /> <br />{" "}
            Happy exploring, <br /> The Team at{" "}
            <span className="font-semibold">UpEasy</span>
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Input
              value={`${process.env.NEXTAUTH_URL}/register?referId=${registeredUsername}`}
              readOnly
              className="w-full"
            />
            <Button
              onClick={handleCopyUsername}
              className="flex items-center gap-2"
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="w-full bg-brand-1 hover:bg-brand-2 font-semibold"
            onClick={handleCloseDialog}
          >
            Proceed to Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
