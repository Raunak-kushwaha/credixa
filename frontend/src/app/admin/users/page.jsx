"use client";

import React, { useState, useEffect } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import Link from "next/link";
import Pagination from "@/components/Pagination";

const AdminUsersPage = () => {
  const [usersData, setUsersData] = useState({ users: [], count:0, page:1, limit:50, totalPages:0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // fetchUsers is defined outside useEffect so other handlers can call it (e.g. pagination)
  const fetchUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get("/admin/users", {
        params: { page, limit: usersData.limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.users) {
        // Only show non-admin users in Manage Users
        setUsersData({
          users: response.data.users.filter((u) => u.role !== 'admin'),
          count: response.data.count,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFreeze = async (userId) => {
    try {
      setActionLoading(userId);
      const token = localStorage.getItem("token");
      const response = await axiosClient.patch(
        `/admin/user/${userId}/freeze`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("User frozen successfully");
        setUsersData((prev) => ({
          ...prev,
          users: prev.users.map((u) =>
            u._id === userId ? { ...u, isFreezed: true } : u
          ),
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || error.response?.data?.message || "Failed to freeze user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnfreeze = async (userId) => {
    try {
      setActionLoading(userId);
      const token = localStorage.getItem("token");
      const response = await axiosClient.patch(
        `/admin/user/${userId}/unfreeze`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("User unfrozen successfully");
        setUsersData((prev) => ({
          ...prev,
          users: prev.users.map((u) =>
            u._id === userId ? { ...u, isFreezed: false } : u
          ),
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || error.response?.data?.message || "Failed to unfreeze user");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
        <div className="mt-4 text-sm text-gray-500">
        Total Users: <span className="font-semibold text-gray-800">{usersData.count}</span>
      </div>
        <Link
          href="/admin/dashboard"
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              {/* Role column removed intentionally */}
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Account Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Approval Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Freeze Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {usersData.users.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              usersData.users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  {/* Role removed: do not display user.role here */}
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.ac_type}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isFreezed
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.isFreezed ? "Frozen" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {user.isFreezed ? (
                      <button
                        onClick={() => handleUnfreeze(user._id)}
                        disabled={actionLoading === user._id}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs font-semibold transition disabled:opacity-50"
                      >
                        {actionLoading === user._id ? "..." : "Unfreeze"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFreeze(user._id)}
                        disabled={actionLoading === user._id}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-xs font-semibold transition disabled:opacity-50"
                      >
                        {actionLoading === user._id ? "..." : "Freeze"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination controls */}
      {usersData.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={usersData.page}
            totalPages={usersData.totalPages}
            onPageChange={(p) => fetchUsers(p)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
