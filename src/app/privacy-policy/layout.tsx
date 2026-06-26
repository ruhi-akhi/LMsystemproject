import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "How Smart Inventory collects, uses, and protects your personal and business data.",
  path: "/privacy-policy",
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
