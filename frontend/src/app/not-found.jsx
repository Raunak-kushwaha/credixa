"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/reusable/Logo";
import { ArrowLeft, Home, LifeBuoy } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const [dashboardHref, setDashboardHref] = useState("/");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setDashboardHref(role === "admin" ? "/admin/dashboard" : "/");
  }, []);

  const shortPath = useMemo(() => {
    if (!pathname) return "";
    return pathname.length > 36 ? `${pathname.slice(0, 36)}…` : pathname;
  }, [pathname]);

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Logo href={dashboardHref} variant="dark" />
          <span className="text-xs font-medium text-gray-500">
            Error <span className="text-gray-800">404</span>
          </span>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="relative px-6 py-10 sm:px-10">
            {/* subtle background */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-200 blur-3xl" />
            </div>

            <div className="relative">
              <p className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Page not found
              </p>

              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                We can’t find that page.
              </h1>

              <p className="mt-3 text-sm sm:text-base text-gray-600">
                The link may be broken, or the page may have been moved. If you typed the
                address, double-check the spelling.
              </p>

              {shortPath && (
                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs text-gray-500">Requested path</p>
                  <p className="mt-1 font-mono text-sm text-gray-800 break-all">
                    {shortPath}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go back
                </button>

                <Link
                  href={dashboardHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Home className="h-4 w-4" />
                  Go to dashboard
                </Link>

                <a
                  href="mailto:support@credixa.com"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 sm:ml-auto"
                >
                  <LifeBuoy className="h-4 w-4" />
                  Contact support
                </a>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <p className="text-xs text-gray-500">
                  Helpful links
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/transactions"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Transactions
                  </Link>
                  <Link
                    href="/amount"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Add funds
                  </Link>
                  <Link
                    href="/fd-amount"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Fixed deposits
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Credixa. All rights reserved.
        </p>
      </div>
    </div>
  );
}