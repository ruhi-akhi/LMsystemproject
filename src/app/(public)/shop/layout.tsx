import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop - Smart Inventory & Ordering System",
  description: "Browse products, order items directly using our QR code payment system, and manage your inventory with ease.",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
