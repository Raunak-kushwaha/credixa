"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";

export default function AdminLayoutWrapper({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isAdminPage = window.location.pathname.startsWith("/admin");

    // Allow access to /admin/login without role check
    if (window.location.pathname === "/admin/login") {
      return;
    }

    // For other admin pages, verify authentication and role
    if (isAdminPage && window.location.pathname !== "/admin/login") {
      // If not authenticated, redirect to admin login
      if (!token) {
        router.push("/admin/login");
        return;
      }

      // If user (non-admin) tries to access admin routes, redirect to user dashboard
      if (role !== "admin") {
        toast.error("Admins only. Redirecting to dashboard...");
        router.push("/");
        return;
      }
    }
  }, [router]);

  // For /admin/login, render without AdminLayout
  if (typeof window !== "undefined" && window.location.pathname === "/admin/login") {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

