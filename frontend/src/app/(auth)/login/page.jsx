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
      
      toast.success(data.msg || "Login Successful");

      localStorage.setItem("token", data.token);

     await fetchUserProfile()

     router.push("/")


      helpers.resetForm();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
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
        >
          <Form className="w-full max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-center">Login</h2>

            {/* Email Field */}
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Password Field */}
            <div>
              <Field
                type="text"
                name="password"
                placeholder="Password"
                className="w-full py-3 px-3 rounded border outline-none"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Submit Button */}
            <CustomAuthButton
              text="Login"
              type="submit"
              isLoading={loading}
            />

            {/* Register Link */}
            <p className="text-end text-sm">
              New user?{" "}
              <Link href="/register" className="text-blue-600 underline">
                Register here
              </Link>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
