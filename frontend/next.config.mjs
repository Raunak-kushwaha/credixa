/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  reactCompiler: true,
  // expose API url variable if needed (NEXT_PUBLIC_ prefix already exposed automatically)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || ''
  }
};

export default nextConfig;
