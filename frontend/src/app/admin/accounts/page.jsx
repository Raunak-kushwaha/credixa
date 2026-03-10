"use client";

import React, { useState, useEffect } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import Link from "next/link";
import Pagination from "@/components/Pagination";

const AdminAccountsPage = () => {
  const [accountsData, setAccountsData] = useState({ accounts: [], count: 0, page: 1, limit: 50, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axiosClient.get("/admin/accounts", {
        params: { page, limit: accountsData.limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.accounts) {
        setAccountsData({
          accounts: response.data.accounts.filter((a) => a.user?.role !== 'admin'),
          count: response.data.count,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  const totalAmount = accountsData.accounts.reduce((sum, acc) => sum + (acc.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Accounts</h1>
        <Link
          href="/admin/dashboard"
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Accounts</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {accountsData.count}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Amount</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹{totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Average Amount (this page)</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            ₹{(accountsData.accounts.length > 0 ? (totalAmount / accountsData.accounts.length).toFixed(2) : 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Account ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                User Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {accountsData.accounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No accounts found
                </td>
              </tr>
            ) : (
              accountsData.accounts.map((account) => (
                <tr key={account._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {account._id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {account.user?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {account.user?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ₹{account.amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {accountsData.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={accountsData.page}
            totalPages={accountsData.totalPages}
            onPageChange={(p) => fetchAccounts(p)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminAccountsPage;
