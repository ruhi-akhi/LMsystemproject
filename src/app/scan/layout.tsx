import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Scan Product",
  description: "Scan a product QR code to view details and add items to your order.",
  path: "/scan",
  noIndex: true,
});

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
