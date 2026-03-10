"use client";

import React, { useState, useEffect } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import Link from "next/link";
import Pagination from "@/components/Pagination";

const AdminFixDepositsPage = () => {
  const [fixData, setFixData] = useState({ fixDeposits: [], count: 0, page: 1, limit: 50, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchFixDeposits = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get("/admin/fixed-deposits", {
        params: { page, limit: fixData.limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.fixDeposits) {
        setFixData({
          fixDeposits: response.data.fixDeposits,
          count: response.data.count,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to fetch fixed deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixDeposits();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  const claimedFDs = fixData.fixDeposits.filter((fd) => fd.isClaimed).length;
  const unclaimedFDs = fixData.fixDeposits.length - claimedFDs;
  const totalInterest = fixData.fixDeposits.reduce((sum, fd) => sum + (fd.interest_amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Fixed Deposits</h1>
        <Link
          href="/admin/dashboard"
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total FDs</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {fixData.count}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Claimed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {claimedFDs}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Unclaimed</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {unclaimedFDs}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Interest</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            ₹{totalInterest.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                User Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Apply For
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Interest
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {fixData.fixDeposits.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No fixed deposits found
                </td>
              </tr>
            ) : (
              fixData.fixDeposits.map((fd) => (
                <tr key={fd._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {fd.user?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {fd.user?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {fd.apply_for || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ₹{fd.amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                    ₹{fd.interest_amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        fd.isClaimed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {fd.isClaimed ? "Claimed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(fd.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {fixData.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={fixData.page}
            totalPages={fixData.totalPages}
            onPageChange={(p) => fetchFixDeposits(p)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminFixDepositsPage;
