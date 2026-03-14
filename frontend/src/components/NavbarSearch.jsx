"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, LayoutDashboard, Users, CreditCard, ArrowLeftRight, PiggyBank, Settings, Activity, Clock, Wallet, UserCircle } from "lucide-react";

const ADMIN_FEATURES = [
  { label: "Overview", description: "Admin dashboard overview", href: "/admin/dashboard", icon: LayoutDashboard, keywords: ["dashboard", "home", "overview", "stats"] },
  { label: "Pending Users", description: "Approve or reject pending registrations", href: "/admin/pending-users", icon: Clock, keywords: ["pending", "approval", "registrations", "new users"] },
  { label: "Users", description: "Manage all registered users", href: "/admin/users", icon: Users, keywords: ["users", "manage", "accounts", "members"] },
  { label: "Accounts", description: "View and manage bank accounts", href: "/admin/accounts", icon: CreditCard, keywords: ["accounts", "bank", "account numbers"] },
  { label: "Transactions", description: "View all user transactions", href: "/admin/transactions", icon: ArrowLeftRight, keywords: ["transactions", "payments", "transfers", "history"] },
  { label: "Finances", description: "Manage fixed deposits & finances", href: "/admin/fds", icon: PiggyBank, keywords: ["finances", "fixed deposits", "fd", "interest", "investments"] },
  { label: "Settings", description: "Platform configuration & tier settings", href: "/admin/settings", icon: Settings, keywords: ["settings", "config", "limits", "fees", "rates", "tiers"] },
  { label: "Admin Activity", description: "Admin action audit log", href: "/admin/activity", icon: Activity, keywords: ["activity", "audit", "log", "actions", "admin"] },
  { label: "Login Activity", description: "User login history & IPs", href: "/admin/login-activity", icon: Clock, keywords: ["login", "activity", "ip", "sessions", "sign-in"] },
];

const USER_FEATURES = [
  { label: "Dashboard", description: "Account overview & analytics", href: "/", icon: LayoutDashboard, keywords: ["dashboard", "home", "overview", "analytics", "wallet"] },
  { label: "Add / Transfer Funds", description: "Add money or transfer to others", href: "/amount", icon: Wallet, keywords: ["funds", "add", "transfer", "money", "send", "deposit", "balance"] },
  { label: "Transactions", description: "View your transaction history", href: "/transactions", icon: ArrowLeftRight, keywords: ["transactions", "payments", "history", "transfers"] },
  { label: "Fixed Deposits", description: "Manage your fixed deposits", href: "/fd-amount", icon: PiggyBank, keywords: ["fixed deposits", "fd", "interest", "investment", "maturity"] },
  { label: "Profile", description: "View and edit your profile", href: "/profile", icon: UserCircle, keywords: ["profile", "account", "personal", "details", "email", "name"] },
];

export default function NavbarSearch({ isAdmin }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const features = isAdmin ? ADMIN_FEATURES : USER_FEATURES;

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return features.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.keywords.some((k) => k.includes(q))
    );
  }, [query, features]);

  const handleSelect = useCallback(
    (href) => {
      setQuery("");
      setIsOpen(false);
      inputRef.current?.blur();
      router.push(href);
    },
    [router]
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      handleSelect(results[activeIndex].href);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.trim().length > 0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Looking for something?.."
          className="w-full min-w-[220px] rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 lg:min-w-[280px]"
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-[360px] overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No matching features found.
            </div>
          ) : (
            <ul role="listbox">
              {results.map((item, idx) => {
                const Icon = item.icon;
                const isActive = idx === activeIndex;
                return (
                  <li key={item.href} role="option" aria-selected={isActive}>
                    <button
                      onClick={() => handleSelect(item.href)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive ? "bg-indigo-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                          isActive
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-medium ${
                            isActive ? "text-indigo-700" : "text-gray-900"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 flex-shrink-0 transition-opacity ${
                          isActive
                            ? "text-indigo-400 opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
