// src/components/ProfileDropdown.tsx
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
import useSessionStore from "@/services/store/useSessionStore";
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
import { useEffect, useMemo } from "react";

// Define the session type (optional, for clarity)
interface SessionData {
  user: {
    id: string;
    name: string;
    email: string;
    jwt: string;
    username?: string;
    profilePicture?: string;
    isAdmin?: boolean;
  };
  expires: string;
}

const ProfileDropdown = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { session: userSession, setSession, clearSession } = useSessionStore();
  const { user } = useUserStore();

  const adminUrl = useMemo(
    () => process.env.NEXT_PUBLIC_REST_API_URL || "#",
    []
  );

  // Sync next-auth session with Zustand store
  useEffect(() => {
    if (status === "authenticated" && session) {
      // Example: Map next-auth session to your session structure
      // Replace with actual session response or API call if needed
      const sessionData: SessionData = {
        user: {
          id: (session as SessionData).user.id || "", // Fallback to an empty string if undefined
          name: session.user?.name || "",
          email: session.user?.email || "",
          jwt: (session as SessionData).user.jwt,
        },
        expires: session.expires,
      };

      setSession(sessionData);
    } else if (status === "unauthenticated") {
      clearSession(); // Clear session on logout
    }
  }, [status, session, setSession, clearSession]);

  // Memoize session button to prevent unnecessary re-renders
  const SessionButton = useMemo(() => {
    const handleSignOut = () =>
      signOut({ redirect: false }).then(() => {
        clearSession(); // Clear Zustand session on sign-out
        router.push(process.env.NEXTAUTH_URL || "/");
      });

    switch (status) {
      case "authenticated":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={session.user?.image ?? "/images/profile-demo.jpeg"}
                />
                <AvatarFallback>UE</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2">
              <DropdownMenuLabel>Control Panel</DropdownMenuLabel>
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
            className="rounded-full h-9 w-9 animate-spin"
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
    clearSession,
    user?.isAdmin,
    session?.user?.image,
  ]);

  return (
    <>
      {status === "loading" ? (
        <div className="w-40 h-9 dark:bg-gray-500 bg-gray-200 animate-pulse rounded-full" />
      ) : (
        <div>
          <p className="italic text-xs text-end">Welcome to UpEasy 👋</p>
          <div className="text-end text-sm">
            {status === "authenticated" ? (
              <p>{user?.username ?? userSession?.user?.name}</p>
            ) : (
              <p>
                Don&apos;t have an account?{" "}
                <span className="underline underline-offset-4 font-semibold">
                  <Link href={"/register"}>Sign up</Link>{" "}
                </span>
              </p>
            )}
          </div>
        </div>
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
