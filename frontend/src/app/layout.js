import { Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/layouts/MainLayout";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Credixa",
  description: "Secure financial transactions made easy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} font-sans`}>
        <MainLayout>{children}</MainLayout>        
      </body>
    </html>
  );
}
