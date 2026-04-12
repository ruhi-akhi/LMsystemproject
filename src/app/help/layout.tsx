import HelpNavbar from "@/components/layout/helpnavbar";

export const metadata = {
  title: "Help Center | Smart Inventory",
  description: "Get support, ask questions, report bugs, and request features in our community help center.",
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900 min-h-screen">
      <HelpNavbar />
      <main>{children}</main>
    </div>
  );
}