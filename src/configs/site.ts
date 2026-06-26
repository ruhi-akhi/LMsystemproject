export const siteConfig = {
  name: "Smart Inventory",
  shortName: "SmartInventory",
  description:
    "Intelligent inventory management system with dashboards, QR ordering, and real-time stock tracking.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  brandColor: "#FF6B35",
  brandColorDark: "#E55A2B",
  demoAdmin: {
    email: "admin@inventory.com",
    password: "admin123",
  },
  links: {
    login: "/login",
    register: "/register",
    dashboard: "/dashboard/inventory",
    demo: "/login",
    qrDemo: "/qr-demo",
    shop: "/shop",
  },
} as const;
