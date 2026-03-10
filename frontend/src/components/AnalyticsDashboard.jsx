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
import { FaUniversity, FaMoneyBillWave } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    monthlyTransactions: [],
    creditVsDebit: { credit: 0, debit: 0 },
    totalFDInvested: 0,
  });
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionView, setTransactionView] = useState('monthly'); // 'monthly' or 'daily'
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token) {
      fetchAnalytics();
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

      // Aggregate transactions by day
      const dailyData = {};
      response.data.data.forEach(txn => {
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
        .sort((a, b) => new Date(a.day) - new Date(b.day))
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Total Received</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{analytics.creditVsDebit.credit.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaArrowTrendUp className="text-green-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{analytics.creditVsDebit.debit.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaArrowTrendDown className="text-red-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Total FD Invested</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{analytics.totalFDInvested.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaUniversity className="text-purple-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Net Balance</p>
              <p className={`text-2xl font-bold ${(analytics.creditVsDebit.credit - analytics.creditVsDebit.debit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{Math.abs(analytics.creditVsDebit.credit - analytics.creditVsDebit.debit).toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-blue-600 text-lg" />
            </div>
          </div>
        </div>
      </div>

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
                <LineChart data={analytics.monthlyTransactions} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
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
                <LineChart data={dailyTransactions} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
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

        {/* Recent Transactions - Top Right */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Transactions</h3>
          <div className="space-y-2 max-h-44 overflow-y-auto">
            {analytics.monthlyTransactions && analytics.monthlyTransactions.length > 0 ? (
              <div className="text-xs space-y-2">
                {[
                  { name: 'Transfer to John', time: '2h ago', amount: '₹500', type: 'debit' },
                  { name: 'Salary Credit', time: '1d ago', amount: '₹25,000', type: 'credit' },
                  { name: 'Grocery Shopping', time: '2d ago', amount: '₹1,200', type: 'debit' },
                ].map((txn, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-xs truncate">{txn.name}</p>
                      <p className="text-gray-500 text-xs">{txn.time}</p>
                    </div>
                    <p className={`font-semibold text-xs ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-xs">No recent transactions</p>
            )}
          </div>
        </div>

        {/* Spending Breakdown - Bottom Right */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Spending Breakdown</h3>
          <div className="space-y-2">
            {[
              { label: 'Food & Dining', amount: '₹3,200', percentage: 32, color: 'bg-orange-500' },
              { label: 'Shopping', amount: '₹2,500', percentage: 25, color: 'bg-blue-500' },
              { label: 'Bills & Utilities', amount: '₹2,000', percentage: 20, color: 'bg-green-500' },
              { label: 'Entertainment', amount: '₹1,300', percentage: 13, color: 'bg-purple-500' },
              { label: 'Others', amount: '₹1,000', percentage: 10, color: 'bg-gray-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-semibold text-gray-800">{item.amount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
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
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-28 text-gray-500 text-xs">
              <p>No data</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Stats</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Monthly Spending</span>
              <span className="font-semibold">₹{(analytics.creditVsDebit.debit / 12).toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Largest Transaction</span>
              <span className="font-semibold">₹25,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction Count</span>
              <span className="font-semibold">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Savings Rate</span>
              <span className="font-semibold text-green-600">23%</span>
            </div>
          </div>
        </div>

        {/* Goals & Targets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Goals & Targets</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Monthly Savings</span>
                <span className="font-semibold">₹8,500 / ₹10,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Investment Goal</span>
                <span className="font-semibold">₹50,000 / ₹1,00,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
