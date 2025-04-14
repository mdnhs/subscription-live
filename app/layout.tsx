import Header from "@/components/navigation/header/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./provider";
import { aboreto, bruno, montserrat } from "./font";
import { siteConfig } from "./site";
import Footer from "@/components/navigation/footer/Footer";

export const metadata: Metadata = {
  title: `${siteConfig.websiteName} - ${siteConfig.websiteTagline}`,
  description: siteConfig.websiteTagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${bruno.variable} ${aboreto.variable} font-montserrat antialiased relative bg-brand-3 overflow-x-hidden`}
      >
        <Toaster position="bottom-right" richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            {children}
            <Footer />
            <SpeedInsights />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
