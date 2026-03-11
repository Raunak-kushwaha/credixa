"use client";

import React, { useEffect, useState } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginActivityPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "admin") {
          toast.error("Access denied. Redirecting...");
          router.push("/login");
          return;
        }

        const response = await axiosClient.get("/admin/login-activity?limit=50", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRows(response.data?.users || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.msg || "Failed to fetch login activity"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [router]);

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-sm text-gray-600">Loading login activity...</div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User login activity</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last sign-ins across your user base.
          </p>
        </div>
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to dashboard
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                User
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Last login
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                IP
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-xs text-gray-500"
                >
                  No login activity recorded yet.
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3 text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(u.lastLoginAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-gray-800">
                      {u.lastLoginIp || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.isFreezed ? (
                      <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                        Frozen
                      </span>
                    ) : u.isApproved ? (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default LoginActivityPage;

