import "./globals.css";
import { ReactNode } from "react";
import { Hanken_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import RouteEffects from "@/components/RouteEffects";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const metadata = {
  title: "Portfolio",
  description: "Aarjav Jain Portfolio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${hankenGrotesk.variable} bg-background text-foreground antialiased`}>
        <SmoothScrollProvider>
          <Navbar />
          <RouteEffects />
          <main className="pt-24 sm:pt-28">{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
