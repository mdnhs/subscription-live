"use client";

import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Only show the UI after mounted to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-5 w-5 opacity-0" />;
    {
      /* Placeholder for toggle */
    }
  }

  const isDarkMode = theme === "dark";

  const handleToggle = (pressed: boolean) => {
    setTheme(pressed ? "dark" : "light");
  };

  return (
    <Toggle
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      pressed={isDarkMode}
      onPressedChange={handleToggle}
      className="bg-transparent cursor-pointer rounded-full p-0 w-fit"
    >
      <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 w-9 px-4 py-2 has-[>svg]:px-3 rounded-full">
        {isDarkMode ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </div>
    </Toggle>
  );
}
