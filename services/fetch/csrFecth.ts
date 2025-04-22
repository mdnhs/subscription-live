/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import useInternetStore from "../store/useInternetStore";
import useNetwork from "@/hooks/useNetwork";

type fetchType = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  cache?: "no-store" | "store";
  payload?: any;
  server?: string;
  jwtToken?: string;
};

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

const useFetch = () => {
  const [isPending, setIsPending] = useState(false);
  const isOnline = useNetwork();
  const { isOnlineStore, setIsOnlineStore } = useInternetStore();

  useEffect(() => {
    if (isOnline && !isOnlineStore) {
      setIsOnlineStore(true);
    }
  }, [isOnline, isOnlineStore, setIsOnlineStore]);

  const fetchPublic = useCallback(
    async (props: fetchType) => {
      setIsPending(true);
      try {
        const headers: Record<string, string> = {
          Accept: "application/json",
          Authorization: `Bearer ${props?.jwtToken ?? apiKey}`,
        };

        // Only set Content-Type for non-FormData payloads
        if (!(props?.payload instanceof FormData)) {
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(
          `${props?.server ?? apiUrl}${props?.path}`,
          {
            cache: props?.cache ?? "no-store",
            method: props?.method,
            headers,
            ...(props?.method !== "GET" &&
              props?.payload && {
                body:
                  props?.payload instanceof FormData
                    ? props?.payload
                    : JSON.stringify(props?.payload),
              }),
          }
        );

        setIsPending(false);

        const json = await response.json();
        const res = {
          success: response.ok,
          data: json,
          message: json?.message,
        };
        // console.log(res);
        if (!response.ok) throw res;

        return res;
      } catch (error: any) {
        setIsPending(false);
        if (!isOnline && isOnlineStore) setIsOnlineStore(false);

        const isNetworkError = !error?.status && isOnline;
        const errorMessage = isNetworkError
          ? error?.data?.error?.message
          : error.message || "An unexpected error occurred.";

        const res = { success: false, data: [], message: errorMessage };

        return res;
      }
    },
    [isOnline, isOnlineStore, setIsOnlineStore]
  );

  return { isPending, fetchPublic };
};

export default useFetch;
