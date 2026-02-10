import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AttendEase | Smart Attendance",
  description: "Anti-cheat attendance system for university courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@8..144,400..500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: "'Google Sans Flex', 'Google Sans', system-ui, -apple-system, sans-serif" }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
