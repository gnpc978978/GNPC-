"use client";
import AdminRoute from "@/components/admin/AdminRoute";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import SuperAdminRoute from "@/components/admin/SuperAdminRoute";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page par sidebar/header mat dikhao
  if (["/admin/login", "/admin/forgot-password"].includes(pathname)) {
    return <>{children}</>;
  }

  const protectedContent =
    pathname.startsWith("/admin/admin-management") || pathname === "/admin/create"
    ? <SuperAdminRoute>{children}</SuperAdminRoute>
    : children;

  return <AdminRoute><SidebarProvider><AdminShell>{protectedContent}</AdminShell></SidebarProvider></AdminRoute>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className={`transition-[padding] duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-[280px]"}`}>
        <Header />

        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
