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
import { FallbackImage } from "@/_components/container/FallbackImage";

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
    <html lang="en" suppressHydrationWarning className=" overflow-x-hidden">
      <body
        className={`${montserrat.variable} ${bruno.variable} ${aboreto.variable} font-montserrat antialiased relative bg-brand-4 overflow-x-hidden !min-w-full`}
      >
        <Toaster position="bottom-right" richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <FallbackImage
              src={"/images/hero-left-bg.svg"}
              className=" h-[1500px] w-[1500px] fixed -top-80 left-0 pointer-events-none  -z-10"
            />
            <FallbackImage
              src={"/images/hero-right-bg.svg"}
              className=" h-[1500px] w-[1500px] fixed -top-80 right-0 pointer-events-none scale-x-[-1] -z-10"
            />
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
