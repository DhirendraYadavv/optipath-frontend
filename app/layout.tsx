import GoogleAuthProvider from "@/components/GoogleAuthProvider";
import { AuthProvider } from "@/components/AuthProvider";
import SignInModal from "@/components/SignInModal";
import SiteHeader from "@/components/SiteHeader";
import type { Metadata } from "next";
import AuthToast from "@/components/AuthToast";
import ClickPulse from "@/components/ClickPulse";
import ScrollReveal from "@/components/ScrollReveal";
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
      suppressHydrationWarning
    >
      <head>
        {/* Marks the page as "scroll effects on" before the first paint, so content does not flash and then hide. */}
        <script dangerouslySetInnerHTML={{ __html: "if('IntersectionObserver' in window)document.documentElement.classList.add('reveal-ready')" }} />
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleAuthProvider>
          <AuthProvider>
            <SiteHeader />
            {children}
            <SignInModal />
            <AuthToast />
            <ClickPulse />
            <ScrollReveal />
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
