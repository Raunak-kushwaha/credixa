import React from "react";
import Link from "next/link";

export default function Logo({ variant = "light", href = "/", className = "" }) {
  const base = "text-xl font-bold transition-colors";
  const variants = {
    light: "text-white hover:text-white/90",
    dark: "text-gray-900 hover:text-gray-700",
  };
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant] || variants.light} ${className}`}
    >
      Credixa
    </Link>
  );
}

