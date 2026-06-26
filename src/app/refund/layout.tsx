import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Refund Policy",
  description: "Refund and cancellation policy for Smart Inventory purchases and subscriptions.",
  path: "/refund",
});

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
