"use client"
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation"; // Import usePathname
import "./globals.css";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { SessionProvider } from '@/context/SessionContext'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get current route
  const isHomePage = pathname === "/"; // Check if it's the home page

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
      >
        {isHomePage && <Navbar  />}
        <SessionProvider>{children}</SessionProvider>
        {isHomePage && <Footer />}
      </body>
    </html>
  );
}
