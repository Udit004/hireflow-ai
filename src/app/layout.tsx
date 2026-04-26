import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProviderComponent } from "@/features/auth";
import AppRootLayout from "@/components/RootLayout";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JD Agentic Test System",
  description:
    "Generate interview tests from a job description and view the result on the same page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProviderComponent>
          <ToastProvider>
            <AppRootLayout>{children}</AppRootLayout>
          </ToastProvider>
        </AuthProviderComponent>
      </body>
    </html>
  );
}
