import type { Metadata } from "next";
import { AdminMobileNav, AdminSidebar, AdminTopbar } from "@/components/admin-ui";

// 519 — robots.txt disallows /admin, but a disallow rule asks a crawler not to
// fetch a URL; it does not remove the URL from an index. The console holds
// nothing but demo state, so the metadata says so directly, at the layout so
// every console route inherits it.
export const metadata: Metadata = {
  title: "Admin console — Motif UI",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-[#08090f]">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminTopbar />
        <AdminMobileNav />
        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
