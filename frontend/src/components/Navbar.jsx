"use client";

import Link from "next/link";
import React from "react";
import Logo from "./reusable/Logo";
import NavbarSearch from "./NavbarSearch";
import { useMainContext } from "@/context/MainContext";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setIsToggled } from "@/redux/slice/sidebarSlice";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { SlMenu } from "react-icons/sl";
import { LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { RiUser5Line, RiShieldUserLine } from "react-icons/ri";

const ADMIN_TABS = [
  { label: "Overview", href: "/admin/dashboard" },
  { label: "Pending", href: "/admin/pending-users" },
  { label: "Users", href: "/admin/users" },
  { label: "Accounts", href: "/admin/accounts" },
  { label: "Transactions", href: "/admin/transactions" },
  { label: "Finances", href: "/admin/fds" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Admin Activity", href: "/admin/activity" },
];

const USER_BREADCRUMB_MAP = [
  { href: "/", label: "Overview" },
  { href: "/amount", label: "Funds" },
  { href: "/transactions", label: "Transactions" },
  { href: "/fd-amount", label: "Fixed Deposits" },
  { href: "/profile", label: "Profile" },
];

function UserBreadcrumbs({ pathname }) {
  const current =
    USER_BREADCRUMB_MAP.find((x) => x.href !== "/" && pathname.startsWith(x.href)) ||
    USER_BREADCRUMB_MAP[0];

  const crumbs = [{ href: "/", label: "Home" }];
  if (current.href !== "/") crumbs.push({ href: current.href, label: current.label });

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center min-w-0">
      <ol className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center min-w-0">
              {i > 0 && <ChevronRight className="h-4 w-4 text-gray-300 mx-1" />}
              {isLast ? (
                <span className="font-medium text-gray-800 truncate">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:text-gray-900 truncate">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ProfileDropdown({ user, onLogout, isAdmin }) {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600">
          {isAdmin ? (
            <RiShieldUserLine className="h-6 w-6" />
          ) : (
            <RiUser5Line className="h-6 w-6" />
          )}
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <span className="max-w-[120px] truncate text-sm font-medium text-gray-700">
            {user?.name || "Account"}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </MenuButton>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white py-1 shadow-lg focus:outline-none">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.name || "User"}
            </p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
          {!isAdmin && (
            <MenuItem>
              {({ focus }) => (
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 ${focus ? "bg-gray-50" : ""}`}
                >
                  <RiUser5Line className="h-4 w-4" />
                  Profile
                </Link>
              )}
            </MenuItem>
          )}
          <MenuItem>
              <button
              onClick={onLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}

export default function Navbar() {
  const { user, LogoutHandler } = useMainContext();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminLogin = pathname === "/admin/login";
  const isAdminArea = pathname.startsWith("/admin") && !isAdminLogin;
  const isUserArea = pathname === "/" || pathname.startsWith("/amount") || 
    pathname.startsWith("/transactions") || pathname.startsWith("/fd-amount") || 
    pathname.startsWith("/profile");
  const isAdmin = user?.role === "admin" || (typeof window !== "undefined" && localStorage.getItem("role") === "admin");

  const showUserNav = isUserArea;
  const showAdminNav = isAdmin && isAdminArea;

  // Auth pages: minimal nav
  if (isAuthPage) {
    return (
      <header className="w-full border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo href="/" variant="dark" />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  // Admin login: minimal nav
  if (isAdminLogin) {
    return (
      <header className="w-full border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo href="/admin/login" variant="dark" />
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Main site
          </Link>
        </nav>
      </header>
    );
  }

  // Admin dashboard: full SaaS nav with tabs
  if (showAdminNav) {
    return (
      <header className="w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
          <nav className="flex h-14 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-6">
              <Logo href="/admin/dashboard" variant="dark" />
              <div className="hidden flex-1 md:flex">
                {ADMIN_TABS.map((tab) => {
                  const isActive =
                    pathname === tab.href ||
                    (tab.href !== "/admin/dashboard" &&
                      pathname.startsWith(tab.href));
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
                      }`}
                    >
                      {tab.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
              <NavbarSearch isAdmin={true} />
              <ProfileDropdown
                user={user}
                onLogout={LogoutHandler}
                isAdmin={true}
              />
            </div>
          </nav>
        </div>
      </header>
    );
  }

  // User dashboard: nav with sidebar toggle + profile
  if (showUserNav) {
    return (
      <header className="w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <nav className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => dispatch(setIsToggled())}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              <SlMenu className="h-5 w-5" />
            </button>
            <Logo href="/" variant="dark" className="flex-shrink-0" />
            <UserBreadcrumbs pathname={pathname} />
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end">
            <NavbarSearch isAdmin={false} />
            <ProfileDropdown
              user={user}
              onLogout={LogoutHandler}
              isAdmin={false}
            />
          </div>
        </nav>
        </div>
      </header>
    );
  }

  // Fallback: minimal for logged-in users on other routes
  if (user) {
    return (
      <header className="w-full border-b border-gray-200 bg-white">
        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo href={isAdmin ? "/admin/dashboard" : "/"} variant="dark" />
          <ProfileDropdown
            user={user}
            onLogout={LogoutHandler}
            isAdmin={isAdmin}
          />
        </nav>
      </header>
    );
  }

  // Not logged in, not on auth page: redirect or minimal
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo href="/" variant="dark" />
        <Link
          href="/login"
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Log in
        </Link>
      </nav>
    </header>
  );
}
