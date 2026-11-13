"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Toast {
  id: number;
  kind: "in" | "out";
  text: string;
}

/** A small message at the top of the screen when someone signs in or out. Its motion is in effects.css. */
export default function AuthToast() {
  const { user, ready } = useAuth();
  // undefined = not known yet (first render), null = signed out, string = signed in
  const current = !ready ? undefined : user ? user.email || user.name : null;
  const [seen, setSeen] = useState<string | null | undefined>(undefined);
  const [toast, setToast] = useState<Toast | null>(null);

  // React's "adjust state while rendering" pattern: no effect needed to notice a change.
  if (current !== seen) {
    setSeen(current);
    if (seen !== undefined && current !== undefined) {
      const next: Omit<Toast, "id"> =
        current === null
          ? { kind: "out", text: "You have signed out." }
          : { kind: "in", text: `Signed in as ${user?.firstName || user?.name || "you"}.` };
      setToast((prev) => ({ id: (prev?.id ?? 0) + 1, ...next })); // a new id restarts the animation if one is still showing
    }
  }

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3300);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] pointer-events-none" role="status" aria-live="polite">
      <div key={toast.id} className="auth-toast flex items-center gap-2 bg-white border border-[#D5E1EE] rounded-full px-4 py-2 shadow-lg text-xs font-semibold text-[#0E1726]">
        {toast.kind === "in" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <LogOut className="w-4 h-4 text-[#0060AA]" />}
        {toast.text}
      </div>
    </div>
  );
}
