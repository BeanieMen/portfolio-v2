import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Portfolio",
  description: "Aarjav Jain Portfolio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#161616] text-white font-manrope">{children}</body>
    </html>
  );
}
