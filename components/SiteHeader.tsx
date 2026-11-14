"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, Handshake, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import SalaryEstimatorModal from "@/components/SalaryEstimatorModal";

/** The top bar on every page: logo, main links, and either "Sign in" or the signed-in name with "Sign out".
 *  The Salary Estimator pop-up is rendered NEXT TO the header, never inside it: the header uses backdrop-filter, and a
 *  fixed pop-up inside such a box would be positioned against the header instead of the screen. */
export default function SiteHeader() {
  const { user, ready, openSignIn, signOut } = useAuth();
  const [showSalary, setShowSalary] = useState(false);
  const onHome = usePathname() === "/";

  // Signing out clears the saved login, then reloads the page so nothing on screen still shows the old account.
  const handleSignOut = () => {
    signOut();
    window.location.reload();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F4F8FC]/90 backdrop-blur-md border-b border-[#D9E4F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center" aria-label="SGT Online home">
            <div className="relative w-36 sm:w-44 h-12">
              <Image src="/sgt-online-logo.png" alt="SGT Online University" fill className="object-contain object-left" priority />
            </div>
          </Link>

          {onHome && (
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#526173]">
              <a href="#programs" className="hover:text-[#0060AA] transition">Programs</a>
              <a href="#how-it-works" className="hover:text-[#0060AA] transition">How it works</a>
              <a href="#faq" className="hover:text-[#0060AA] transition">FAQ</a>
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/portal" className="flex items-center gap-1.5 text-xs font-bold text-[#0060AA] hover:text-[#004D8A] transition cursor-pointer">
              <Handshake className="w-3.5 h-3.5" />
              <span>Talent Gateway</span>
            </Link>
            <button
              onClick={() => setShowSalary(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0060AA] hover:text-[#004D8A] transition cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Salary Estimator</span>
              <span className="sr-only sm:hidden">Salary Estimator</span>
            </button>

            {!ready ? (
              <span className="w-24 h-8" aria-hidden="true" />
            ) : user ? (
              <div key={user.email || user.name} className="auth-pop flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#CBD9E9] shadow-xs">
                {user.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
                <span className="text-xs font-semibold max-w-[110px] truncate">{user.firstName}</span>
                <button onClick={handleSignOut} className="text-[11px] text-rose-700 hover:underline pl-2 border-l border-[#C8D7E8] flex items-center gap-1 cursor-pointer">
                  <LogOut className="w-3 h-3" /> Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => openSignIn()}
                className="text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full bg-[#0060AA] hover:bg-[#004D8A] text-white shadow-xs transition cursor-pointer"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>
      {showSalary && <SalaryEstimatorModal onClose={() => setShowSalary(false)} />}
    </>
  );
}
