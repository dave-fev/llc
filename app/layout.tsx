import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./store/StoreProvider";
import { MaintenanceCheck } from "./components/MaintenanceCheck";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLC Registration - Form Your LLC in Minutes",
  description: "Professional LLC registration service with expert guidance. Fast, secure, and trusted by thousands of businesses.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <MaintenanceCheck>
            {children}
          </MaintenanceCheck>
        </StoreProvider>
      </body>
    </html>
  );
}
