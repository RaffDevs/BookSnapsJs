import { MobileNav } from "@/components/layout/mobile-nav";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen pb-24">
      {children}
      <MobileNav />
    </div>
  );
}
