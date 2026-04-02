import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Sidebar from "@/components/shared/Sidebar";
import MainWrapper from "@/components/layout/MainWrapper";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${jakarta.variable} ${manrope.variable} min-h-screen flex`}
        style={{ fontFamily: "var(--font-manrope), sans-serif" }}
      >
        <Sidebar />
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
}
