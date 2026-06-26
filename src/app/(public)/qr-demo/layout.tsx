import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "QR Ordering Demo",
  description:
    "Try Smart Inventory QR scan-to-order flow — generate QR codes, scan products, and checkout instantly.",
  path: "/qr-demo",
});

export default function QrDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
