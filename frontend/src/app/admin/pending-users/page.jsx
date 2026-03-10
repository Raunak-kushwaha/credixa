'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import { toast } from 'react-toastify';
import { axiosClient }  from '@/utils/AxiosClient';

export default function PendingUsersPage() {
  const [usersData, setUsersData] = useState({ users: [], count: 0, page: 1, limit: 50, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingUsers = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axiosClient.get('/admin/pending-users', {
        params: { page, limit: usersData.limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsersData({
        users: response.data.users || [],
        count: response.data.count || 0,
        page: response.data.page || page,
        limit: response.data.limit || usersData.limit,
        totalPages: response.data.totalPages || 0,
      });
    } catch (error) {
      const msg = error.response?.data?.msg || error.response?.data?.message || error.message;
      toast.error(msg);
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      setActionLoading(userId);
      const token = localStorage.getItem('token');
      const response = await axiosClient.patch(`/admin/approve-user/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('User approved successfully');
      // Remove from list and decrease count
      setUsersData(prev => ({
        ...prev,
        users: prev.users.filter((u) => u._id !== userId),
        count: prev.count - 1,
      }));
    } catch (error) {
      const msg = error.response?.data?.msg || error.response?.data?.message || error.message;
      toast.error(msg);
      console.error('Error approving user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    try {
      setActionLoading(userId);
      const token = localStorage.getItem('token');
      const response = await axiosClient.patch(`/admin/reject-user/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('User rejected and deleted');
      // Remove from list and decrease count
      setUsersData(prev => ({
        ...prev,
        users: prev.users.filter((u) => u._id !== userId),
        count: prev.count - 1,
      }));
    } catch (error) {
      const msg = error.response?.data?.msg || error.response?.data?.message || error.message;
      toast.error(msg);
      console.error('Error rejecting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Pending Users</h1>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <p className="text-gray-600">
            {usersData.count} user{usersData.count !== 1 ? 's' : ''} awaiting approval
          </p>
        </div>

        {/* Empty State */}
        {usersData.users.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No pending users to approve</p>
          </div>
        ) : (
          /* Users Table */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Account Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Applied Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.ac_type === 'saving'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.ac_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(user._id)}
                            disabled={actionLoading === user._id}
                            className="px-4 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === user._id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(user._id)}
                            disabled={actionLoading === user._id}
                            className="px-4 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === user._id ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {usersData.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={usersData.page}
            totalPages={usersData.totalPages}
            onPageChange={(p) => fetchPendingUsers(p)}
          />
        </div>
      )}
    </div>
  );
}
