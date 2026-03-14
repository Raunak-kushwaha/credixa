"use client";

import React, { useState, useEffect } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

export default function AdminSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [settings, setSettings] = useState({
    tiers: {
      saving: { dailyTransferLimit: 20000, transferFeePercent: 2, fdInterestRate: 5.5 },
      current: { dailyTransferLimit: 100000, transferFeePercent: 0.5, fdInterestRate: 6.5 }
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/admin/login");

      const response = await axiosClient.get("/admin/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.settings) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSavingLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.put("/admin/settings", settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(response.data?.msg || "Settings updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to save settings");
    } finally {
      setSavingLoading(false);
    }
  };

  const handleChange = (tier, field, value) => {
    setSettings((prev) => ({
      ...prev,
      tiers: {
        ...prev.tiers,
        [tier]: {
          ...prev.tiers[tier],
          [field]: Number(value)
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg font-medium text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure tier-based limits, transaction fees, and fixed deposit interest rates.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Saving Account Settings */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Saving Account Tier</h3>
            <p className="mt-1 text-sm text-gray-500">Default settings for standard saving accounts.</p>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Daily Transfer Limit (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.tiers.saving.dailyTransferLimit}
                  onChange={(e) => handleChange('saving', 'dailyTransferLimit', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Transfer Fee (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={settings.tiers.saving.transferFeePercent}
                  onChange={(e) => handleChange('saving', 'transferFeePercent', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">FD Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={settings.tiers.saving.fdInterestRate}
                  onChange={(e) => handleChange('saving', 'fdInterestRate', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Account Settings */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Current Account Tier</h3>
            <p className="mt-1 text-sm text-gray-500">Settings for premium business/current accounts.</p>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Daily Transfer Limit (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.tiers.current.dailyTransferLimit}
                  onChange={(e) => handleChange('current', 'dailyTransferLimit', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Transfer Fee (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={settings.tiers.current.transferFeePercent}
                  onChange={(e) => handleChange('current', 'transferFeePercent', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">FD Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={settings.tiers.current.fdInterestRate}
                  onChange={(e) => handleChange('current', 'fdInterestRate', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
