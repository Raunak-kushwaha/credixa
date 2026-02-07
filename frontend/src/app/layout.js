import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import MainLayout from "@/layouts/MainLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const PoppinsFont = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "700"],
});

export const metadata = {
  title: "Credixa",
  description: "Secure financial transactions made easy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${PoppinsFont.variable}`}
      >
        <MainLayout>{children}</MainLayout>        
      </body>
    </html>
  );
}
