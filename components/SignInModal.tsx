"use client";

import React, { useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function SignInModal() {
  const { signInOpen, signInReason, closeSignIn, signInWithCredential } = useAuth();
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!signInOpen) return null;

  // Play the closing animation first, then really close.
  const close = () => {
    if (closing) return;
    setClosing(true);
    timer.current = setTimeout(() => {
      setError("");
      setClosing(false);
      closeSignIn();
    }, 220);
  };

  const missingClientId = !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <div data-closing={closing} onClick={(e) => { if (e.target === e.currentTarget) close(); }} className="modal-backdrop fixed inset-0 z-[60] bg-black/45 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Sign in">
      <div className="modal-panel bg-white border border-[#C8D7E8] rounded-3xl max-w-sm w-full p-7 shadow-2xl relative text-center">
        <button onClick={close} aria-label="Close" className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <h3 className="font-heading text-2xl font-bold text-[#0E1726]">Sign in to continue</h3>
        <p className="text-xs text-[#5B6B80] mt-1 mb-6">
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
                setBusy(true);
                try {
                  await signInWithCredential(res.credential);
                } catch (e: unknown) {
                  setError(e instanceof Error && e.message ? e.message : "Sign-in failed. Please try again.");
                } finally {
                  setBusy(false);
                }
              }}
              onError={() => setError("Google sign-in was cancelled or failed. Please try again.")}
            />
          </div>
        )}

        {busy && <p className="mt-4 text-xs text-[#5B6B80]" role="status">Signing you in. The first sign-in can take up to a minute while our server wakes up.</p>}
        {error && <p className="mt-4 text-xs text-rose-700" role="alert">{error}</p>}
      </div>
    </div>
  );
}
