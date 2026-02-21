import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FleetFlow — Fleet & Logistics Management",
  description:
    "Modular enterprise dashboard for fleet management, trip dispatching, and logistics operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Sidebar />
        <div className="ml-60 min-h-screen bg-[#F9FAFB]">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
