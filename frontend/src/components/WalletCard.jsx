"use client";

import React, { useState } from "react";
import { useMainContext } from "@/context/MainContext";
import Link from "next/link";
import { RiExchangeDollarFill } from "react-icons/ri";
import { LuWallet } from "react-icons/lu";
import { PiHandCoins } from "react-icons/pi";
import { FiEye, FiEyeOff } from "react-icons/fi";

const WalletCard = () => {
  const { user } = useMainContext();
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  return (
    <div className="rounded-xl p-8 mb-8 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-blue-900 text-sm font-medium mb-2">Total Balance</p>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold font-mono">
              {isBalanceVisible ? `₹${user?.amount || 0}` : "₹****"}
            </h1>
            <button
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="bg-blue-100 hover:bg-blue-300 rounded-full p-2 transition"
            >
              {isBalanceVisible ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
        </div>
        <LuWallet className="text-5xl opacity-20" />
      </div>

      <div className="mb-6 pb-6 border-b border-blue-400 border-opacity-30">
        <p className="text-blue-900 text-sm">Account Type</p>
        <p className="text-lg font-semibold capitalize">{user?.ac_type || "Saving"} Account</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Link
          href="/amount"
          className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-1"
        >
          <LuWallet className="text-lg" />
          Add Money
        </Link>

       

        <Link
          href="/fd-amount"
          className="bg-purple-200 hover:bg-purple-300 text-purple-900 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-1"
        >
          <PiHandCoins className="text-lg" />
          Create FD
        </Link>
      </div>
    </div>
  );
};

export default WalletCard;
