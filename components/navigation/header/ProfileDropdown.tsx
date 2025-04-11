"use client";

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
import { Session } from "next-auth";

interface ProfileDropdownProps {
  currentUser: {
    username?: string;
    profilePicture?: string;
    isAdmin?: boolean;
    id?: string;
    email?: string;
    bio?: string;
    birthDate?: string;
    phoneNumber?: string;
  };
}

const ProfileDropdown = ({ currentUser }: ProfileDropdownProps) => {
  const router = useRouter();
  const {
    status,
  }: {
    data: Session | null;
    status: "authenticated" | "loading" | "unauthenticated";
  } = useSession();

  const adminUrl = process.env.NEXT_PUBLIC_REST_API_URL || "#";

  const handleSignOut = () =>
    signOut({ redirect: false }).then(() =>
      router.push(process.env.NEXTAUTH_URL || "/")
    );

  let sessionButton;

  if (status === "authenticated") {
    sessionButton = (
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
          <Avatar>
            <AvatarImage
              src={currentUser?.profilePicture ?? "/images/profile-demo.jpeg"}
            />
            <AvatarFallback>UE</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2">
          <DropdownMenuLabel>Control Panel</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {currentUser?.isAdmin && (
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
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else if (status === "loading") {
    sessionButton = (
      <Button variant={"outline"} className="rounded-full h-9 w-9 animate-spin">
        <Loader />
      </Button>
    );
  } else {
    sessionButton = (
      <Link href="/login">
        <Button variant="outline" className="rounded-full">
          <LogIn /> Sign In
        </Button>
      </Link>
    );
  }

  return (
    <>
      {status === "loading" ? (
        <div className="w-40 h-9  dark:bg-gray-500 bg-gray-200 animate-pulse rounded-full" />
      ) : status === "authenticated" && currentUser?.username ? (
        `Welcome, ${currentUser.username} 👋`
      ) : (
        "Welcome, Guest 👋"
      )}

      {sessionButton}
      {status === "loading" ? (
        <Button className="rounded-full h-9 w-9 animate-pulse dark:bg-gray-500 bg-gray-200"></Button>
      ) : (
        <ModeToggle />
      )}
    </>
  );
};

export default ProfileDropdown;
