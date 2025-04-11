// app/_components/ProgressBar.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Start progress
    setProgress(10);

    // Animate to 90%
    const timer: NodeJS.Timeout = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer); // Stop interval at 90%
          return 90;
        }
        return Math.min(90, prev + 10); // Increment by 10 for smoother steps
      });
    }, 50); // Faster interval for smoother animation

    // Complete to 100% and reset
    const completeProgress = () => {
      setProgress(100);
      const resetTimer = setTimeout(() => {
        setProgress(0); // Hide bar
      }, 300);
      return () => clearTimeout(resetTimer);
    };

    const completionTimer = setTimeout(completeProgress, 600); // Slightly longer delay

    return () => {
      clearInterval(timer);
      clearTimeout(completionTimer);
      // Avoid resetting progress here to prevent interruption
    };
  }, [pathname, searchParams]);

  if (progress === 0) return null;

  return (
    <div
      className="relative h-0.5 bg-gradient-to-r from-transparent to-brand-1 transition-all duration-200 ease-out"
      style={{ width: `${progress}%` }}
    />
  );
}