"use client";

import React, { useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Link from "next/link";

import { axiosClient } from "@/utils/AxiosClient";
import CustomAuthButton from "@/components/reusable/CustomAuthButton";
import { useMainContext } from "@/context/MainContext";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { fetchUserProfile } = useMainContext()
  const router = useRouter()
  // ---------- Form Initial Values ----------
  const initialValues = {
    email: "",
    password: "",
  };

  // ---------- Validation Schema ----------
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // ---------- Submit Handler ----------
  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);

      const response = await axiosClient.post("/auth/login", values);
      const data = response.data;
      
      // Success toast
      const successMsg = data.message || data.msg || "Login Successful";
      toast.success(successMsg);

      // Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Fetch user profile
      await fetchUserProfile();

      // Redirect based on role
      if (data.role === "admin") {
        toast.info("Redirecting to admin dashboard...");
        setTimeout(() => router.push("/admin/dashboard"), 500);
      } else {
        toast.info("Redirecting to dashboard...");
        setTimeout(() => router.push("/"), 500);
      }

      helpers.resetForm();
    } catch (error) {
      // Handle different error types
      let errorMsg = "Login failed";
      
      if (error.response?.data) {
        errorMsg = error.response.data.msg || error.response.data.message || errorMsg;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      // Specific error handling
      if (errorMsg.includes("does not exist")) {
        toast.error("Email not registered. Please create a new account.");
        helpers.setFieldError("email", "This email is not registered");
      } else if (errorMsg.includes("password")) {
        toast.error("Incorrect password. Please try again.");
        helpers.setFieldError("password", "Password is incorrect");
      } else if (errorMsg.includes("frozen")) {
        toast.error("Your account is frozen. Please contact support.");
      } else if (errorMsg.includes("pending approval")) {
        toast.error("Your account is pending admin approval. Please wait.");
      } else {
        toast.error(errorMsg);
      }
      
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-lg p-10 bg-white shadow-md rounded-md flex justify-center">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ errors, touched }) => (
            <Form className="w-full max-w-md space-y-4">
              <h2 className="text-2xl font-bold text-center">Login</h2>

              {/* Email Field */}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full py-3 px-3 rounded border outline-none transition ${
                    touched.email && errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {touched.email && errors.email && (
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                )}
              </div>

              {/* Password Field */}
              <div>
                <Field
                  type="text"
                  name="password"
                  placeholder="Password"
                  className={`w-full py-3 px-3 rounded border outline-none transition ${
                    touched.password && errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {touched.password && errors.password && (
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                )}
              </div>

              {/* Submit Button */}
              <CustomAuthButton
                text="Login"
                type="submit"
                isLoading={loading}
              />

              {/* Register Link */}
              <p className="text-center text-sm font-semibold">
                New user?{" "}
                <Link href="/register" className="text-blue-600 underline">
                  Register here
                </Link>
              </p>

              {/* Admin Login Link */}
              <p className="text-center text-sm">
                <Link href="/admin/login" className="text-green-600 underline font-semibold">
                  Click here to log in as admin
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
