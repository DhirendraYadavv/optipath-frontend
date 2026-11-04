import GoogleAuthProvider from "@/components/GoogleAuthProvider";
import { AuthProvider } from "@/components/AuthProvider";
import SignInModal from "@/components/SignInModal";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptiPath | SGT Sahayak AI",
  description:
    "Check how ready you are for your target role, see your skill gap, and find the SGT Online programme that closes it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAuthProvider>
          <AuthProvider>
            {children}
            <SignInModal />
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
