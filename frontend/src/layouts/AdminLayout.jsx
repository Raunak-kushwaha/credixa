"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { Provider } from "react-redux";
import { MainContextProvider } from "@/context/MainContext";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLayout = ({ children }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <Provider store={store}>
      <MainContextProvider>
        <ToastContainer />
        

        {/* Main Content */}
        <main className="min-h-[calc(100vh-56px)] bg-gray-50">
          {children}
        </main>
      </MainContextProvider>
    </Provider>
  );
};

export default AdminLayout;
