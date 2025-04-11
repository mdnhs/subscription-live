"use client";
import { FallbackImage } from "@/_components/container/FallbackImage";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const HeaderLogo = () => {
  const { status } = useSession();
  return (
    <div>
      {status === "loading" ? (
        <div className="dark:bg-gray-500 bg-gray-200 rounded-2xl animate-pulse w-[50px] h-[50px]"></div>
      ) : (
        <Link href="/" className="text-lg font-bold">
          <FallbackImage
            src="/images/logo/upeasy-logo.svg"
            width={50}
            height={50}
            quality={100}
          />
        </Link>
      )}
    </div>
  );
};

export default HeaderLogo;
