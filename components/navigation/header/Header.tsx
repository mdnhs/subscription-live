"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, ShoppingBag, ShoppingCart } from "lucide-react";

import { useCartStore } from "@/_store/CartStore";
import { useUserStore } from "@/_store/UserStore";
import CartPopover from "@/_components/cart/CartPopover";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FallbackImage } from "@/_components/container/FallbackImage";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { carts, isCartOpen, getCartItems, setCartOpen } = useCartStore();
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
    if (userEmail) getCartItems(userEmail);
  }, [jwtToken, userEmail, getCurrentUser, getCartItems]);

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

  // Memoize cart items for popover
  const cartItems = useMemo(
    () =>
      carts.map((cart) => ({
        id: cart.id,
        products: cart.products || [],
      })),
    [carts]
  );

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

            <Popover open={isCartOpen} onOpenChange={setCartOpen}>
              <PopoverTrigger className="relative flex size-9 items-center justify-center gap-2 rounded-full border bg-background shadow-xs outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:border-input dark:bg-input/30 dark:hover:bg-input/50">
                <ShoppingCart className="size-[1.2rem]" />
                {carts.length > 0 && (
                  <span className="absolute bottom-4 left-4 flex size-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-semibold text-white">
                    {carts.length}
                  </span>
                )}
              </PopoverTrigger>
              <PopoverContent className="mt-5 w-[340px]">
                <CartPopover data={cartItems} />
                <div className="mt-4 flex justify-between gap-4">
                  <Link href="/cart" className="basis-1/2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setCartOpen(false)}
                    >
                      <ShoppingCart className="mr-2" /> View Cart (
                      {carts.length})
                    </Button>
                  </Link>
                  <Button
                    className="basis-1/2"
                    onClick={() => {
                      router.push("/checkout");
                      setCartOpen(false);
                    }}
                  >
                    <ShoppingBag className="mr-2" /> Checkout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

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
