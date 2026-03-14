"use client";

import React, { useState, useEffect } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import { Clock, User, Target, Activity } from "lucide-react";
import Link from "next/link";

const AdminActivityPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axiosClient.get("/admin/activity", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.logs) {
          setLogs(response.data.logs);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.msg ||
            error.response?.data?.message ||
            "Failed to fetch activity logs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionBadgeColor = (action) => {
    const colors = {
      APPROVE_USER: "bg-green-100 text-green-800 border-green-200",
      REJECT_USER: "bg-red-100 text-red-800 border-red-200",
      FREEZE_ACCOUNT: "bg-orange-100 text-orange-800 border-orange-200",
      UNFREEZE_ACCOUNT: "bg-blue-100 text-blue-800 border-blue-200",
      UPDATE_SETTINGS: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[action] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatActionLabel = (action) => {
    return action.replace(/_/g, " ").toLowerCase();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Activity Feed</h1>
          <p className="text-gray-600">Track all administrative actions and changes</p>
        </div>
        <Link
          href="/admin/dashboard"
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition duration-200 shadow-md hover:shadow-lg"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="space-y-6">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No activity logs found</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={log.id || index} className="relative">
              {/* Timeline line */}
              {index < logs.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-indigo-200 to-transparent"></div>
              )}

              <div className="flex items-start space-x-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-800">{log.adminName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionBadgeColor(log.action)}`}>
                      {formatActionLabel(log.action)}
                    </span>
                    {log.targetUser && (
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{log.targetUser}</span>
                      </div>
                    )}
                  </div>

                  {log.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{log.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminActivityPage;