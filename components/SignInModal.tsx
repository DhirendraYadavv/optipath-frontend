"use client";

import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function SignInModal() {
  const { signInOpen, signInReason, closeSignIn, signInWithCredential } = useAuth();
  const [error, setError] = useState("");

  if (!signInOpen) return null;

  const close = () => {
    setError("");
    closeSignIn();
  };

  const missingClientId = !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <div className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Sign in">
      <div className="bg-white border border-[#DDD8CE] rounded-3xl max-w-sm w-full p-7 shadow-2xl relative text-center">
        <button onClick={close} aria-label="Close" className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <h3 className="font-serif text-2xl font-bold text-[#0E1726]">Sign in to continue</h3>
        <p className="text-xs text-[#64748B] mt-1 mb-6">
          {signInReason || "Use your Google account. No OTP and no password to remember."}
        </p>

        {missingClientId ? (
          <p className="text-xs text-rose-700">
            Google sign-in is not configured (NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing in .env.local).
          </p>
        ) : (
          <div className="flex justify-center w-full my-2">
            <GoogleLogin
              onSuccess={async (res) => {
                setError("");
                if (!res.credential) {
                  setError("Google did not return a sign-in token. Please try again.");
                  return;
                }
                try {
                  await signInWithCredential(res.credential);
                } catch (e: any) {
                  setError(e?.message || "Sign-in failed. Please try again.");
                }
              }}
              onError={() => setError("Google sign-in was cancelled or failed. Please try again.")}
            />
          </div>
        )}

        {error && <p className="mt-4 text-xs text-rose-700" role="alert">{error}</p>}
      </div>
    </div>
  );
}
