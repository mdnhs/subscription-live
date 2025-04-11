import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page = () => {
  // If using App Router with client-side, you could use useSearchParams
  // For simplicity, assuming server-side or static rendering here
  return (
    <div className="container py-5">
      <div className="flex flex-col gap-8 min-h-screen items-center justify-center bg-background/95 text-white rounded-2xl">
        <CircleCheckBig className="size-36 text-teal-600" />
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-[24px]">Payment Successful!</h2>
          <h2 className="text-[17px] text-center text-gray-200">
            We sent an email with your order confirmation along with Digital Content
          </h2>
        </div>
        <Link
          href="/"
          className="block rounded bg-teal-600 px-5 py-3 text-sm text-white transition hover:bg-teal-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Page;