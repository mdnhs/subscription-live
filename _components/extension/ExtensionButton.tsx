"use client";

import { Button } from "@/components/ui/button";
import { getExtension } from "@/services/api/extensionRequest";
import useFetch from "@/services/fetch/csrFecth";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// Utility to parse Google Drive file ID from URL
const parseGoogleDriveFileId = (url: string): string => {
  if (!url.includes("drive.google.com")) return url;
  const matches = url.match(/\/d\/(.+?)(?:\/|$)/);
  return matches && matches[1] ? matches[1] : url;
};

const ExtensionButton: React.FC = () => {
  const { fetchPublic } = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized direct download URL generator
  const getDirectDownloadUrl = useMemo(
    () => (fileId: string) =>
      `https://drive.google.com/uc?export=download&id=${fileId}`,
    []
  );

  // Handle button click with debouncing and download process
  const handleDownload = useCallback(async () => {
    if (isLoading) return; // Prevent multiple clicks

    // Debounce rapid clicks
    if (clickTimeoutRef.current) return;

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      // Call API to get extension data
      const req = getExtension();
      const response = await fetchPublic({
        ...req,
        signal: abortControllerRef.current.signal,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch extension");
      }

      const extensionData = response.data.data;

      if (!extensionData?.length) {
        throw new Error("No extension available for download");
      }

      // Get and parse download URL
      const originalDownloadUrl = extensionData[0].downloadUrl;
      const fileId = parseGoogleDriveFileId(originalDownloadUrl);
      const directDownloadUrl = getDirectDownloadUrl(fileId);

      // Create and trigger download
      const link = document.createElement("a");
      link.href = directDownloadUrl;
      link.download = "extension.zip";
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      toast.success("Extension download started");

      // Prevent rapid clicks for 1 second
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
      }, 1000);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return; // Ignore abort errors
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process download";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [fetchPublic, getDirectDownloadUrl, isLoading]);

  // Cleanup on component unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleDownload}
        disabled={isLoading}
        className="[background:linear-gradient(152deg,#FFF_-185.49%,#EA721C_94.01%),#477BFF] rounded-full font-semibold text-white h-12 px-6"
      >
        <span>{isLoading ? "Downloading Extension..." : "Download Extension"}</span>
      </Button>
    </div>
  );
};

export default ExtensionButton;
