"use client";

import React, { useState, useEffect } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import {
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
import { toast } from "react-toastify";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    monthlyTransactions: [],
    creditVsDebit: { credit: 0, debit: 0 },
    totalFDInvested: 0,
  });
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [tx30d, setTx30d] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionView, setTransactionView] = useState('monthly'); // 'monthly' or 'daily'
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token) {
      fetchAnalytics();
      fetchRecentTransactions();
      // Preload last-30-days dataset so side widgets are real immediately
      fetchDailyTransactions();
    }
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/amount/analytics', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await axiosClient.get('/amount/transactions', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: 1,
          limit: 3,
        }
      });
      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      setRecentTransactions(items.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error);
    }
  };

  const fetchDailyTransactions = async () => {
    try {
      // Get transactions for the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const response = await axiosClient.get('/amount/transactions', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit: 1000 // Get more data for daily aggregation
        }
      });

      const txns = Array.isArray(response.data?.data) ? response.data.data : [];
      setTx30d(txns);

      // Aggregate transactions by day
      const dailyData = {};
      txns.forEach(txn => {
        if (txn.isSuccess) {
          const date = new Date(txn.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD format
          if (!dailyData[date]) {
            dailyData[date] = 0;
          }
          dailyData[date] += txn.amount;
        }
      });

      // Convert to array format for chart
      const dailyArray = Object.entries(dailyData)
        .map(([date, total]) => ({
          day: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total: total
        }))
        // sort by the actual date rather than the formatted label
        .sort((a, b) => {
          const parse = (label) => new Date(`${label} ${new Date().getFullYear()}`);
          return parse(a.day) - parse(b.day);
        })
        .slice(-14); // Show last 14 days

      setDailyTransactions(dailyArray);
    } catch (error) {
      console.error('Failed to fetch daily transactions:', error);
      toast.error("Failed to load daily transactions");
    }
  };

  const handleViewChange = async (view) => {
    setTransactionView(view);
    if (view === 'daily' && dailyTransactions.length === 0) {
      await fetchDailyTransactions();
    }
  };

  const creditVsDebitData = [
    { name: 'Credit', value: analytics.creditVsDebit.credit, color: '#10b981' },
    { name: 'Debit', value: analytics.creditVsDebit.debit, color: '#ef4444' }
  ];

  const COLORS = ['#10b981', '#ef4444'];

  const successful30d = tx30d.filter((t) => t?.isSuccess);
  const debit30d = successful30d.filter((t) => t.type === "debit");
  const credit30d = successful30d.filter((t) => t.type === "credit");
  const fd30d = successful30d.filter((t) => t.type === "fix_deposit");

  const totalDebit30d = debit30d.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalCredit30d = credit30d.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalFd30d = fd30d.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const largestTxn = successful30d.reduce((max, t) => {
    const amt = Number(t.amount) || 0;
    return amt > (Number(max?.amount) || 0) ? t : max;
  }, null);

  const spendingBreakdown = [
    { label: "Debit", amount: totalDebit30d, color: "bg-red-500" },
    { label: "Fixed Deposit", amount: totalFd30d, color: "bg-purple-500" },
  ].filter((x) => x.amount > 0);
  const spendingTotal = spendingBreakdown.reduce((s, x) => s + x.amount, 0) || 1;

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Charts Section - Compact Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Transaction Chart - Left Side */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-800">
              {transactionView === 'monthly' ? 'Monthly' : 'Daily'} Transactions
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => handleViewChange('monthly')}
                className={`px-2 py-1 text-xs font-medium rounded transition ${
                  transactionView === 'monthly'
                    ? 'text-white bg-blue-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleViewChange('daily')}
                className={`px-2 py-1 text-xs font-medium rounded transition ${
                  transactionView === 'daily'
                    ? 'text-white bg-blue-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Daily
              </button>
            </div>
          </div>
          {transactionView === 'monthly' ? (
            analytics.monthlyTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={analytics.monthlyTransactions} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                    width={25}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '11px'
                    }}
                    formatter={(value) => [`₹${value}`, 'Amount']}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-44 text-gray-500 text-xs">
                <p>No data</p>
              </div>
            )
          ) : (
            dailyTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={dailyTransactions} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                    width={25}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '11px'
                    }}
                    formatter={(value) => [`₹${value}`, 'Amount']}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-44 text-gray-500 text-xs">
                <p>Loading...</p>
              </div>
            )
          )}
        </div>

        {/* Quick Stats - Top Right */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Stats</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Money In (30d)</span>
              <span className="font-semibold text-green-600">₹{totalCredit30d.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Money Out (30d)</span>
              <span className="font-semibold text-red-600">₹{(totalDebit30d + totalFd30d).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Txns (30d)</span>
              <span className="font-semibold">{successful30d.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Largest txn (30d)</span>
              <span className="font-semibold">
                ₹{Number(largestTxn?.amount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Spending Breakdown - Bottom Right */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Money Out (last 30 days)</h3>
            <button
              onClick={() => handleViewChange('daily')}
              className="text-xs font-medium text-blue-600 hover:underline"
              type="button"
            >
              View daily
            </button>
          </div>
          <div className="space-y-2">
            {spendingBreakdown.length > 0 ? spendingBreakdown.map((item) => {
              const pct = Math.round((item.amount / spendingTotal) * 100);
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-gray-800">₹{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-gray-500 text-xs">No outgoing transactions in the last 30 days</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row - Additional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Credit vs Debit Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Credit vs Debit</h3>
          {(analytics.creditVsDebit.credit > 0 || analytics.creditVsDebit.debit > 0) ? (
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={creditVsDebitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {creditVsDebitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${value}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-28 text-gray-500 text-xs">
              <p>No data</p>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Recent 3 Transactions</h3>
            <a href="/transactions" className="text-xs font-medium text-blue-600 hover:underline">View all</a>
          </div>
          <div className="space-y-2 max-h-44 overflow-y-auto">
            {recentTransactions.length > 0 ? (
              <div className="text-xs space-y-2">
                {recentTransactions.map((txn) => {
                  const isCredit = txn.type === "credit";
                  const isDebit = txn.type === "debit" || txn.type === "fix_deposit";
                  const sign = isCredit ? "+" : isDebit ? "-" : "";
                  const color = isCredit ? "text-green-600" : "text-red-600";
                  const title = txn.remark || (isCredit ? "Credit" : "Debit");
                  const time = txn.createdAt ? new Date(txn.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
                  return (
                    <div key={txn._id || `${txn.createdAt}-${txn.amount}`} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-b-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-xs truncate">
                          {title}
                          {!txn.isSuccess && <span className="ml-2 text-[10px] text-amber-600 font-semibold">PENDING</span>}
                        </p>
                        <p className="text-gray-500 text-xs truncate">{time}</p>
                      </div>
                      <p className={`font-semibold text-xs ${color}`}>
                        {sign}₹{Number(txn.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-xs">No recent transactions</p>
            )}
          </div>
        </div>

        {/* Activity Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Account Health</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Failed / pending txns (30d)</span>
              <span className="font-semibold text-amber-600">
                {tx30d.filter((t) => !t?.isSuccess).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Fixed deposits created (30d)</span>
              <span className="font-semibold text-purple-600">{fd30d.length}</span>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
              <p className="text-gray-700 font-semibold">Tip:</p>
              <p className="text-gray-600 mt-1">
                Review recent transactions regularly and report anything suspicious.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
