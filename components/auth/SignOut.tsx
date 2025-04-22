"use client";
import useSessionStore from "@/services/store/useSessionStore";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SignOut = () => {
  const { clearSession } = useSessionStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  // Control dialog open state based on activeTab
  const [isOpen, setIsOpen] = useState(activeTab === "signout");

  // Update dialog state when activeTab changes
  useEffect(() => {
    setIsOpen(activeTab === "signout");
  }, [activeTab]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    clearSession();
    router.push(process.env.NEXTAUTH_URL || "/");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          router.push("/my-account?tab=profile");
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <LogOut className="w-5 h-5 mr-2 text-brand-1" />
            Sign Out
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">Are you sure you want to sign out of your account?</p>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignOut;