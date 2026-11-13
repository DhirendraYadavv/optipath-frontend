import GoogleAuthProvider from "@/components/GoogleAuthProvider";
import { AuthProvider } from "@/components/AuthProvider";
import SignInModal from "@/components/SignInModal";
import type { Metadata } from "next";
import AuthToast from "@/components/AuthToast";
import ClickPulse from "@/components/ClickPulse";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./theme.css";
import "./effects.css";

// Headings use Plus Jakarta Sans, everything else uses Inter. Change the fonts here and the palette in theme.css.
const headingFont = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
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
      className={`${headingFont.variable} ${bodyFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAuthProvider>
          <AuthProvider>
            {children}
            <SignInModal />
            <AuthToast />
            <ClickPulse />
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
