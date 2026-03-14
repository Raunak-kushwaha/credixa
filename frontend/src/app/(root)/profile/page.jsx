"use client";

import React, { useState, useEffect } from "react";
import { useMainContext } from "@/context/MainContext";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import {
  User, Mail, CreditCard, Clock, PenLine,
  Save, X, Eye, EyeOff, Wallet, CheckCircle2, AlertTriangle, Loader2
} from "lucide-react";
import { RiUser5Line, RiShieldUserLine } from "react-icons/ri";
import { PiPassword } from "react-icons/pi";
import { GoShieldLock } from "react-icons/go";

function InfoRow({ icon: Icon, label, value, badge }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="truncate text-sm font-medium text-gray-900">{value || "—"}</p>
          {badge}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, headerRight }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-indigo-500" />
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        {headerRight}
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, fetchUserProfile } = useMainContext();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [showPwSection, setShowPwSection] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (user?.name) setNameValue(user.name);
  }, [user]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // ---- Name update ----
  const handleSaveName = async () => {
    if (!nameValue.trim()) return toast.error("Name cannot be empty");
    setSavingName(true);
    try {
      const res = await axiosClient.put(
        "/auth/profile",
        { name: nameValue.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.msg || "Name updated");
      await fetchUserProfile();
      setEditingName(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  // ---- Password change ----
  const handleChangePw = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) return toast.error("Passwords don't match");
    if (newPw.length < 6) return toast.error("Password must be at least 6 characters");
    setSavingPw(true);
    try {
      const res = await axiosClient.put(
        "/auth/change-password",
        { currentPassword: currentPw, newPassword: newPw },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.msg || "Password changed");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setShowPwSection(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to change password");
    } finally {
      setSavingPw(false);
    }
  };

  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "—";

  const lastLogin = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : null;

  const acTypeBadge = (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${user.ac_type === "current"
        ? "bg-violet-50 text-violet-700"
        : "bg-sky-50 text-sky-700"
        }`}
    >
      {user.ac_type === "current" ? "Current" : "Savings"}
    </span>
  );

  const statusBadge = user.isFreezed ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
      <AlertTriangle className="h-3 w-3" /> Frozen
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> Active
    </span>
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* ── Profile Header — full width ── */}
        <div className="md:col-span-3 overflow-hidden rounded-xl border border-gray-300 bg-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm shadow-lg">
              {user.role === 'admin' ? (
                <GoShieldLock className="h-10 w-10 text-indigo-600" />
              ) : (
                <RiUser5Line className="h-10 w-10 text-indigo-600" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-indigo-600 font-medium">{user.email}</p>
              <p className="mt-0.5 text-xs text-indigo-900">Member since {memberSince}</p>
            </div>
          </div>
        </div>

        {/* ── Personal Information — spans 2 cols ── */}
        <div className="md:col-span-2">
          <SectionCard
            title="Personal Information"
            icon={User}
            headerRight={
              !editingName ? (
                <button
                  onClick={() => {
                    setNameValue(user.name);
                    setEditingName(true);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <PenLine className="h-3.5 w-3.5" /> Edit
                </button>
              ) : null
            }
          >
            {editingName ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {savingName ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                <InfoRow icon={User} label="Name" value={user.name} />
                <InfoRow icon={Mail} label="Email" value={user.email} />
                <InfoRow
                  icon={CreditCard}
                  label="Account Type"
                  value={user.ac_type === "current" ? "Current Account" : "Savings Account"}
                  badge={acTypeBadge}
                />
              </div>
            )}
          </SectionCard>
        </div>

        {/* ── Account Details — 1 col, stacked tiles ── */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              <Wallet className="h-3.5 w-3.5" /> Balance
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{Number(user.amount || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              <CreditCard className="h-3.5 w-3.5" /> Account No.
            </div>
            <p className="font-mono text-sm font-semibold text-gray-900 truncate">
              {user.account_no || "—"}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              <GoShieldLock className="h-3.5 w-3.5" /> Status
            </div>
            <div className="mt-1">{statusBadge}</div>
          </div>
        </div>

        {/* ── Security — full width ── */}
        <div className="md:col-span-3">
          <SectionCard
            title="Security"
            icon={GoShieldLock}
            headerRight={
              !showPwSection ? (
                <button
                  onClick={() => setShowPwSection(true)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Change Password
                </button>
              ) : null
            }
          >
            {showPwSection ? (
              <form onSubmit={handleChangePw} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Current password */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? "text" : "password"}
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPw ? "text" : "password"}
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        required
                        minLength={6}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {confirmPw && newPw !== confirmPw && (
                      <p className="mt-1 text-xs text-red-500">Passwords don&apos;t match</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={savingPw}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {savingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPwSection(false);
                      setCurrentPw("");
                      setNewPw("");
                      setConfirmPw("");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap gap-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <PiPassword className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Password</p>
                    <p className="mt-0.5 text-sm text-gray-900">••••••••</p>
                  </div>
                </div>
                {lastLogin && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Last Login</p>
                      <p className="mt-0.5 text-sm text-gray-900">{lastLogin}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        </div>

      </div>
    </main>
  );
}
