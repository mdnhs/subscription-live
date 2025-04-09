"use client";
import { Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { FallbackImage } from "@/_components/container/FallbackImage";
import { useUserStore } from "@/_store/UserStore";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { getCurrentUser, user } = useUserStore();

  // Memoize derived values
  const jwtToken = useMemo(
    () => (session?.user as { jwt?: string })?.jwt || "",
    [session]
  );
  const adminUrl = useMemo(
    () => process.env.NEXT_PUBLIC_REST_API_URL || "#",
    []
  );
  const userEmail = useMemo(() => session?.user?.email, [session]);

  // Combine effects with proper dependency handling
  useEffect(() => {
    if (jwtToken) getCurrentUser(jwtToken);
  }, [jwtToken, userEmail, getCurrentUser]);

  // Memoize session button to prevent unnecessary re-renders
  const SessionButton = useMemo(() => {
    const handleSignOut = () =>
      signOut({ redirect: false }).then(() =>
        router.push(process.env.NEXTAUTH_URL || "/")
      );

    switch (status) {
      case "authenticated":
        return (
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        );
      case "loading":
        return (
          <span className="text-muted-foreground text-sm">Loading...</span>
        );
      default:
        return (
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
        );
    }
  }, [status, router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            <FallbackImage
              src="/images/logo/upeasy-logo.svg"
              width={50}
              height={50}
              quality={100}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {status === "authenticated" && (
              <Link href="/my-orders">
                <Button variant="ghost">My Orders</Button>
              </Link>
            )}
            {user?.isAdmin && (
              <Link href={adminUrl} target="_blank">
                <Button variant="ghost">Admin</Button>
              </Link>
            )}
            {SessionButton}

            <ModeToggle />
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <nav className="mt-4 flex flex-col gap-4">
                {user?.isAdmin && (
                  <Link href="/admin-dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      Admin
                    </Button>
                  </Link>
                )}
                {SessionButton}
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
