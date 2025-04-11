"use client";
import { useUserStore } from "@/_store/UserStore";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader,
  LogIn,
  LogOut,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const ProfileDropdown = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user } = useUserStore();

  const adminUrl = useMemo(
    () => process.env.NEXT_PUBLIC_REST_API_URL || "#",
    []
  );

  // Memoize session button to prevent unnecessary re-renders
  const SessionButton = useMemo(() => {
    const handleSignOut = () =>
      signOut({ redirect: false }).then(() =>
        router.push(process.env.NEXTAUTH_URL || "/")
      );

    switch (status) {
      case "authenticated":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={user?.profilePicture ?? "/images/profile-demo.jpeg"}
                />
                <AvatarFallback>UE</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2">
              <DropdownMenuLabel>
                Hello, {session?.user?.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user?.isAdmin && (
                <Link href={adminUrl} target="_blank">
                  <DropdownMenuItem className="cursor-pointer">
                    <Sparkles />
                    Admin
                  </DropdownMenuItem>
                </Link>
              )}
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/my-orders">
                <DropdownMenuItem className="cursor-pointer">
                  <ShoppingBag />
                  My Orders
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer"
              >
                <LogOut /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case "loading":
        return (
          <Button
            variant={"outline"}
            className="rounded-full h-9 w-9 animate-spin "
          >
            <Loader />
          </Button>
        );
      default:
        return (
          <Link href="/login">
            <Button variant="outline" className="rounded-full">
              <LogIn /> Sign In
            </Button>
          </Link>
        );
    }
  }, [
    status,
    router,
    adminUrl,
    user?.isAdmin,
    user?.profilePicture,
    session?.user?.name,
  ]);
  return (
    <>
      {status === "loading" ? (
        <div className="w-40 h-9  dark:bg-gray-500 bg-gray-200 animate-pulse rounded-full" />
      ) : status === "authenticated" && user?.username ? (
        `Welcome, ${user.username} 👋`
      ) : (
        "Welcome, Guest 👋"
      )}

      {SessionButton}
      {status === "loading" ? (
        <Button className="rounded-full h-9 w-9 animate-pulse dark:bg-gray-500 bg-gray-200"></Button>
      ) : (
        <ModeToggle />
      )}
    </>
  );
};

export default ProfileDropdown;
