"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ProgressProvider } from "@bprogress/next/app";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <ProgressProvider
        height="2px"
        color="#e9711b"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </SessionProvider>
  );
}
