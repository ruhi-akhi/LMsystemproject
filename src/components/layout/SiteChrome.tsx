"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CHROME_HIDDEN_PREFIXES = [
  "/dashboard",
  "/login",
  "/register",
  "/verify-otp",
  "/send-otp",
  "/forgot-password",
  "/callback",
];

function shouldHideSiteChrome(pathname: string | null): boolean {
  if (!pathname) return false;
  return CHROME_HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Wait until mount so server + first client render match (avoids hydration errors).
  const hideChrome = mounted && shouldHideSiteChrome(pathname);

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-28">{children}</main>
      <Footer />
    </>
  );
}
