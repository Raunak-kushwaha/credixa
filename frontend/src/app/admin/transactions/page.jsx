"use client";

import React, { useState, useEffect } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import Link from "next/link";
import Pagination from "@/components/Pagination";

const AdminTransactionsPage = () => {
  const [transactionData, setTransactionData] = useState({ data: [], count: 0, page: 1, limit: 50, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: ""
  });

  const fetchTransactions = async (filterParams = {}, page = 1, limitParam = limit) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      
      if (filterParams.type) queryParams.append("type", filterParams.type);
      if (filterParams.startDate) queryParams.append("startDate", filterParams.startDate);
      if (filterParams.endDate) queryParams.append("endDate", filterParams.endDate);
      if (filterParams.minAmount) queryParams.append("minAmount", filterParams.minAmount);
      if (filterParams.maxAmount) queryParams.append("maxAmount", filterParams.maxAmount);

      queryParams.append("page", page);
      queryParams.append("limit", limitParam);

      const response = await axiosClient.get(`/admin/transactions?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.transactions) {
        setTransactionData({
          data: response.data.transactions,
          count: response.data.count,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(filters, 1, limit);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchTransactions(filters, 1);
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: ""
    });
    fetchTransactions({}, 1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  const successTransactions = transactionData.data.filter((t) => t.isSuccess).length;
  const failedTransactions = transactionData.data.length - successTransactions;
  const totalAmount = transactionData.data.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Transactions</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="limit" className="text-sm font-semibold text-gray-700">
              Records per page:
            </label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value);
                setLimit(newLimit);
                fetchTransactions(filters, 1, newLimit);
              }}
              className="px-3 py-2 border border-gray-300 rounded bg-white text-sm"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
          <Link
            href="/admin/dashboard"
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Transactions</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {transactionData.data.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Successful</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {successTransactions}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Failed</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {failedTransactions}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Amount in Transactions</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            ₹{totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Transactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
            >
              <option value="">All Types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Min Amount</label>
            <input
              type="number"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Max Amount</label>
            <input
              type="number"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                User Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Remark
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {transactionData.data.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactionData.data.map((transaction) => (
                <tr key={transaction._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {transaction.user?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ₹{transaction.amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-800"
                          : transaction.type === "debit"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.isSuccess
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.isSuccess ? "Success" : "Failed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {transaction.remark || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {transactionData.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={transactionData.page}
            totalPages={transactionData.totalPages}
            onPageChange={(p) => fetchTransactions(filters, p, limit)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsPage;
