"use client";

import React, { useState } from "react";
import { useMainContext } from "@/context/MainContext";
import Link from "next/link";
import { LuWallet } from "react-icons/lu";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaAsterisk } from "react-icons/fa";
import { toast } from "react-toastify";
import AddAmountModal from "@/components/Amount/AddAmmountModal";
import TransferModal from "@/components/Amount/TransferModal";

const WalletCard = () => {
  const { user } = useMainContext();
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const accountNo = user?.account_no;

  const copyAccountNo = async () => {
    try {
      if (!accountNo) return;
      await navigator.clipboard.writeText(String(accountNo));
      toast.success("Account number copied");
    } catch (e) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="rounded-xl p-6 mb-8 bg-white shadow-sm border border-gray-100">
      
      {/* */}
<div className="rounded-xl p-6 mb-6 bg-indigo-50 border border-indigo-100">
  <div className="flex items-center justify-between mb-8">
    <div>
      <p className="text-blue-900 text-sm font-medium mb-2">Total Balance</p>
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-semibold text-gray-900 leading-none">
          {isBalanceVisible ? (
            `₹${Number(user?.amount || 0).toLocaleString()}`
          ) : (
            <span className="flex items-center gap-1 text-gray-600">
              ₹
              {[...Array(6)].map((_, i) => (
                <FaAsterisk key={i} className="text-xs" />
              ))}
            </span>
          )}
        </h1>
        <button
          onClick={() => setIsBalanceVisible(!isBalanceVisible)}
          className="self-center bg-white/80 hover:bg-white rounded-full p-2 transition flex-shrink-0 border border-indigo-100"
        >
          {isBalanceVisible ? <FiEye /> : <FiEyeOff />}
        </button>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <p className="text-xs text-gray-600">
          Account: <span className="font-medium text-gray-800">{accountNo || "—"}</span>
        </p>
        {accountNo && (
          <button
            type="button"
            onClick={copyAccountNo}
            className="text-xs font-medium text-indigo-700 hover:underline"
          >
            Copy
          </button>
        )}
      </div>
    </div>
    <LuWallet className="text-5xl opacity-20 self-start" />
  </div>
</div>

      {/* Account type */}
      <div className="mb-6 pb-6 border-b border-blue-300 border-opacity-30">
        <p className="text-blue-900 text-sm">Account Type</p>
        <p className="text-lg capitalize">{user?.ac_type || "Saving"} Account</p>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-3">
        <AddAmountModal
          id={accountNo}
          className="rounded-lg border border-gray-200 bg-white p-3 text-left hover:bg-gray-50 transition"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Add money</p>
          </div>
        </AddAmountModal>

        <TransferModal
          id={accountNo}
          className="rounded-lg border border-gray-200 bg-white p-3 text-left hover:bg-gray-50 transition"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Transfer</p>
          </div>
        </TransferModal>

        <Link
          href="/fd-amount"
          className="rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50 transition"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Create FD</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default WalletCard;