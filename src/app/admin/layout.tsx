import { AdminSidebar, AdminTopbar } from "@/components/admin-ui";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-[#08090f]">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminTopbar />
        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
