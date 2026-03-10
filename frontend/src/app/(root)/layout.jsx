"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If admin tries to access user routes (/, /amount, /fd-amount, etc.), redirect to admin dashboard
    if (token && role === "admin") {
      toast.info("Redirecting to admin dashboard...");
      router.push("/admin/dashboard");
      return;
    }
  }, [router]);

  return <>{children}</>;
}
