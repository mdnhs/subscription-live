"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <Button
          variant="outline"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/");
            });
          }}
        >
          Sign Out
        </Button>
      );
    } else if (status === "loading") {
      return <span className="text-muted-foreground text-sm">Loading...</span>;
    } else {
      return (
        <Link href="/login">
          <Button variant="outline">Sign In</Button>
        </Link>
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold">
            Logo
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {session?.user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="ghost">Admin</Button>
              </Link>
            )}
            {showSession()}
            <ModeToggle />
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <nav className="flex flex-col gap-4 mt-4">
                {session?.user?.role === "admin" && (
                  <Link href="/admin-dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      Admin
                    </Button>
                  </Link>
                )}
                {showSession()}
                <ModeToggle />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;