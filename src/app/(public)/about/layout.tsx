import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Smart Inventory System",
  description: "Learn more about Smart Inventory, our mission, our values, and how we help over 15 million users scale their operations.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
