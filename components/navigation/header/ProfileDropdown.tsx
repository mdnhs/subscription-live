"use client";
import { User as UserType } from "@/_types/usersTypes";
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
import { getCurrentUser } from "@/services/api/userRequest";
import useFetch from "@/services/fetch/csrFecth";
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
import { useEffect, useMemo, useState } from "react";

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
  const { fetchPublic } = useFetch();
  const { data: session, status } = useSession();
  const { session: userSession, setSession, clearSession } = useSessionStore();
  const [userData, setUserData] = useState<UserType>();
  const [isLoading, setIsLoading] = useState(false);

  const adminUrl = useMemo(
    () => process.env.NEXT_PUBLIC_REST_API_URL || "#",
    []
  );

  // Sync next-auth session with Zustand store and fetch user data
  useEffect(() => {
    // Only proceed if authenticated and we have a session
    if (status !== "authenticated" || !session) {
      return;
    }

    // Sync session with store first (this doesn't need to be gated by loading state)
    const sessionData: SessionData = {
      user: {
        id: (session as SessionData).user.id || "",
        name: session.user?.name || "",
        email: session.user?.email || "",
        jwt: (session as SessionData).user.jwt,
      },
      expires: session.expires,
    };
    setSession(sessionData);

    // Setup function to fetch user data
    const fetchUserData = async () => {
      // Prevent duplicate API calls
      if (isLoading || userData) {
        return;
      }

      setIsLoading(true);

      try {
        const req = getCurrentUser((session as SessionData).user.jwt);
        const response = await fetchPublic(req);

        if (!response.success) {
          throw new Error(response.message || "User get failed");
        }

        setUserData(response?.data);
      } catch (error) {
        console.error("User get error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch user data
    fetchUserData();
  }, [status, session, setSession, fetchPublic, userData, isLoading]);

  // Handle unauthenticated state
  useEffect(() => {
    if (status === "unauthenticated") {
      clearSession();
      setUserData(undefined); // Clear user data when logged out
    }
  }, [status, clearSession]);

  // Memoize session button
  const SessionButton = useMemo(() => {
    const handleSignOut = () =>
      signOut({ redirect: false }).then(() => {
        clearSession();
        setUserData(undefined);
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
            <DropdownMenuContent
              className="mt-2"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userData?.isAdmin && (
                <Link href={adminUrl} target="_blank">
                  <DropdownMenuItem className="cursor-pointer">
                    <Sparkles />
                    Admin
                  </DropdownMenuItem>
                </Link>
              )}
              <Link href="/my-account?tab=profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/my-account?tab=my-orders">
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
    userData?.isAdmin,
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
              <p>{userData?.username ?? userSession?.user?.name}</p>
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
      {/* {status === "loading" ? (
        <Button className="rounded-full h-9 w-9 animate-pulse dark:bg-gray-500 bg-gray-200"></Button>
      ) : (
        <ModeToggle />
      )} */}
    </>
  );
};

export default ProfileDropdown;
