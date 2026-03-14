"use client";

import React, { useState, useEffect } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUsers, FaCreditCard, FaExchangeAlt, FaLock, FaMoneyBillWave } from "react-icons/fa";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const typeLabel = (type) => {
  const map = { credit: "Credit", debit: "Debit", fix_deposit: "Fix Deposit" };
  return map[type] || type;
};

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const computeMonthDelta = (series) => {
  if (!series || series.length === 0) return null;

  // Find latest month with any activity
  const nonZero = series.filter((item) => item.total > 0);
  const latest = nonZero.length > 0 ? nonZero[nonZero.length - 1] : series[series.length - 1];
  const latestIndex = series.findIndex((item) => item.month === latest.month);
  const prev = latestIndex > 0 ? series[latestIndex - 1] : null;

  if (!prev) {
    return {
      label: latest.month,
      current: latest.total,
      change: null,
    };
  }

  const denominator = prev.total === 0 ? 1 : prev.total;
  const change = ((latest.total - prev.total) / denominator) * 100;

  return {
    label: latest.month,
    current: latest.total,
    change,
  };
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalFixDeposits: 0,
    totalAmount: 0,
  });
  const [charts, setCharts] = useState({
    monthlyTransactions: [],
    userGrowth: [],
    dailyTransactions: [],
    dailyUserGrowth: [],
    transactionTypes: [],
    moneyFlow: { incoming: 0, outgoing: 0 },
  });
  const [pendingUsers, setPendingUsers] = useState(0);
  const [activity, setActivity] = useState({ lastLoginAt: null, lastLoginIp: "" });
  const [txView, setTxView] = useState("monthly"); // monthly | daily
  const [userView, setUserView] = useState("monthly"); // monthly | daily
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "admin") {
          toast.error("Access denied. Redirecting...");
          router.push("/login");
          return;
        }

        const response = await axiosClient.get("/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingResponse = await axiosClient.get("/admin/pending-users/count", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          if (response.data.stats) {
            setStats({
              totalUsers: response.data.stats.totalUsers ?? 0,
              totalAccounts: response.data.stats.totalAccounts ?? 0,
              totalTransactions: response.data.stats.totalTransactions ?? 0,
              totalFixDeposits: response.data.stats.totalFDs ?? 0,
              totalAmount: response.data.stats.totalMoneyInSystem ?? 0,
            });
          }
          if (response.data.activity) {
            setActivity({
              lastLoginAt: response.data.activity.lastLoginAt || null,
              lastLoginIp: response.data.activity.lastLoginIp || "",
            });
          }
          if (response.data.charts) {
            setCharts({
              monthlyTransactions: response.data.charts.monthlyTransactions ?? [],
              userGrowth: response.data.charts.userGrowth ?? [],
              dailyTransactions: response.data.charts.dailyTransactions ?? [],
              dailyUserGrowth: response.data.charts.dailyUserGrowth ?? [],
              transactionTypes: response.data.charts.transactionTypes ?? [],
              moneyFlow: response.data.charts.moneyFlow ?? { incoming: 0, outgoing: 0 },
            });
          }
        }
        if (typeof pendingResponse.data?.count !== "undefined") {
          setPendingUsers(pendingResponse.data.count);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.msg || "Failed to fetch analytics"
        );
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [router]);

  const txDelta = computeMonthDelta(charts.monthlyTransactions);
  const userDelta = computeMonthDelta(charts.userGrowth);


  const StatCard = ({ title, value, icon, link, subtitle, delta }) => {
    const hasDelta = typeof delta === "number" && !Number.isNaN(delta);
    const isPositive = hasDelta && delta >= 0;

    return (
      <Link href={link} className="group block">
        <div
          className={`rounded-xl bg-white shadow-sm p-5 flex flex-col gap-3 
          transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 
          border border-gray-100 h-[160px]`}
        >
          {/* Top row: icon + title */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
              {title}
            </p>
            <div className="text-xl text-gray-400 group-hover:text-gray-600 transition-colors">
              {icon}
            </div>
          </div>

          {/* Value */}
          <div>
            <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
            {subtitle && (
              <p className="text-[11px] text-gray-500 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>

          {/* Bottom row: delta badge OR fallback, + "View →" */}
          <div className="flex items-center justify-between mt-auto">
            {hasDelta ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold
                ${isPositive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-600"
                  }`}
              >
                {isPositive ? "▲" : "▼"}
                {Math.abs(delta).toFixed(1)}%
                <span className="font-normal text-gray-500">vs last month</span>
              </span>
            ) : (
              <span></span>
            )}

            <span className="text-[11px] font-medium text-gray-800 opacity-50 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          </div>
        </div>
      </Link>
    );
  };

  const SegmentedToggle = ({ value, onChange }) => (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${value === "monthly"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("daily")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${value === "daily"
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Daily
      </button>
    </div>
  );

  const ChartCard = ({ title, children, viewLink, viewLabel, headerLeft }) => (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {headerLeft}
        </div>
        {viewLink && (
          <Link
            href={viewLink}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            {viewLabel} →
          </Link>
        )}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Action required + Activity log row */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">

        {/* Pending Users */}
        <Link
          href="/admin/pending-users"
          className="flex-1 flex items-center justify-between gap-4 rounded-xl border border-amber-400 bg-yellow-100 px-5 py-4 hover:bg-amber-100 hover:border-amber-600 transition"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2">
              <FaUsers className="text-amber-600 text-xl" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Review pending users</h2>
              <dl className="space-y-1 text-xs text-gray-600 mt-1">
                <div className="flex gap-3">
                  <dt>Pending approvals</dt>
                  <dd className="font-medium text-gray-900">{pendingUsers} user{pendingUsers === 1 ? "" : "s"}</dd>
                </div>
              </dl>
            </div>
          </div>
          <span className="text-sm font-medium text-amber-700 whitespace-nowrap">
            Go to pending →
          </span>
        </Link>

        {/* Activity Log */}
        <Link
          href="/admin/login-activity"
          className="flex-1 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:bg-zinc-50 hover:border-gray-300 transition"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <FaExchangeAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Activity log</h2>
              <dl className="space-y-1 text-xs text-gray-600 mt-1">
                <div className="flex gap-3">
                  <dt>Admin last login</dt>
                  <dd className="font-medium text-gray-900">
                    {activity.lastLoginAt
                      ? new Date(activity.lastLoginAt).toLocaleString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })
                      : "Not available"}
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt>Admin IP</dt>
                  <dd className="font-mono text-[11px] text-gray-900">{activity.lastLoginIp || "Not recorded"}</dd>
                </div>
              </dl>
            </div>
          </div>
          <span className="text-[14px] font-medium text-blue-600 whitespace-nowrap">
            View user logins →
          </span>
        </Link>

      </div>

      {/* Stats Grid - clickable, drill-down */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle={userDelta ? `New in ${userDelta.label}: ${userDelta.current}` : "All-time users"}
          delta={userDelta?.change ?? null}
          icon={<FaUsers />}
          link="/admin/users"
        />
        <StatCard
          title="Total Accounts"
          value={stats.totalAccounts}
          subtitle="All-time accounts"
          delta={null}
          icon={<FaCreditCard />}
          link="/admin/accounts"
        />
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          subtitle={txDelta ? `Tx in ${txDelta.label}: ${txDelta.current}` : "All-time transactions"}
          delta={txDelta?.change ?? null}
          icon={<FaExchangeAlt />}
          link="/admin/transactions"
        />
        <StatCard
          title="Total Fixed Deposits"
          value={stats.totalFixDeposits}
          subtitle="Active fixed deposits"
          delta={null}
          icon={<FaLock />}
          link="/admin/fds"
        />
        <StatCard
          title="Total Amount"
          value={`₹${stats.totalAmount?.toLocaleString() || 0}`}
          subtitle="Money in system"
          delta={null}
          icon={<FaMoneyBillWave />}
          link="/admin/accounts"
        />
      </div>

      {/* Analytics - non-clickable charts with contextual drill-down links */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Platform insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Monthly Transactions"
            viewLink="/admin/transactions"
            viewLabel="View transactions"
            headerLeft={<SegmentedToggle value={txView} onChange={setTxView} />}
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={txView === "daily" ? charts.dailyTransactions : charts.monthlyTransactions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey={txView === "daily" ? "day" : "month"}
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    formatter={(value) => [value, "Transactions"]}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="User Growth"
            viewLink="/admin/users"
            viewLabel="View users"
            headerLeft={<SegmentedToggle value={userView} onChange={setUserView} />}
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userView === "daily" ? charts.dailyUserGrowth : charts.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey={userView === "daily" ? "day" : "month"}
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    formatter={(value) => [value, "Users"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Transaction Types"
            viewLink="/admin/transactions"
            viewLabel="View transactions"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.transactionTypes.map((t) => ({
                      name: typeLabel(t.type),
                      value: t.count,
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {charts.transactionTypes.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    formatter={(value) => [value, "Count"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Money Flow"
            viewLink="/admin/transactions"
            viewLabel="View transactions"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Incoming", value: charts.moneyFlow.incoming },
                      { name: "Outgoing", value: charts.moneyFlow.outgoing },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Amount"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </section>


    </main>
  );
};

export default AdminDashboard;



