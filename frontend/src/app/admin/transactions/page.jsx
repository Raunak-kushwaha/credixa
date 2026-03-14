"use client";

import React, { useState, useEffect } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { Filter, Calendar, IndianRupee, Search, X } from "lucide-react";

const AdminTransactionsPage = () => {
  const [transactionData, setTransactionData] = useState({ data: [], count: 0, page: 1, limit: 50, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(25);
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
  const formatTransactionDateTime = (value) =>
    new Date(value).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

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
              <option value={10}>10</option>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 transition-all">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="flex items-center text-gray-700 mr-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span className="font-semibold text-sm">Filters</span>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-4 pr-9 py-1.5 cursor-pointer outline-none transition-shadow hover:border-gray-300"
              >
                <option value="">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 transition-shadow hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
              <Calendar size={15} className="text-gray-400 mr-2" />
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="bg-transparent text-sm text-gray-700 outline-none w-32 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                aria-label="Start Date"
              />
              <span className="text-gray-400 mx-2 text-sm font-medium">to</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="bg-transparent text-sm text-gray-700 outline-none w-32 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                aria-label="End Date"
              />
            </div>

            {/* Amount Range Filter */}
            <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 transition-shadow hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
              <IndianRupee size={15} className="text-gray-400 mr-1" />
              <input
                type="number"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                placeholder="Min"
                className="bg-transparent text-sm text-gray-700 outline-none w-20 appearance-none m-0"
                aria-label="Min Amount"
              />
              <span className="text-gray-400 mx-2 text-sm font-medium">-</span>
              <input
                type="number"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                placeholder="Max"
                className="bg-transparent text-sm text-gray-700 outline-none w-20 appearance-none m-0"
                aria-label="Max Amount"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={applyFilters}
              className="flex-1 lg:flex-none flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-5 rounded-full transition-colors text-sm shadow-sm hover:shadow active:scale-95"
            >
              <Search size={15} className="mr-1.5" />
              Search
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 lg:flex-none flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-medium py-1.5 px-4 rounded-full transition-colors text-sm border border-gray-200 shadow-sm hover:shadow active:scale-95"
              title="Reset Filters"
            >
              <X size={15} className="mr-1" />
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full table-auto">
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Remark
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
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
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.type === "credit"
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
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.isSuccess
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {transaction.isSuccess ? "Success" : "Failed"}
                    </span>
                  </td>
                  <td
                    title={transaction.remark || "N/A"}
                    className="px-4 py-4 text-sm text-gray-800 max-w-32 truncate"
                  >
                    {transaction.remark || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {formatTransactionDateTime(transaction.createdAt)}
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
