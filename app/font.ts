import { Bruno_Ace_SC, Aboreto, Montserrat } from "next/font/google";

export const bruno = Bruno_Ace_SC({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-bruno",
});

export const aboreto = Aboreto({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-aboreto",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
});
