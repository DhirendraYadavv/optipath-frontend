"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { googleLogout } from "@react-oauth/google";
import { API_URL } from "@/lib/siteConfig";

export interface AuthUser {
  name: string;
  firstName: string;
  email: string;
  picture?: string;
}

interface AuthContextValue {
  /** The signed-in Google user, or null. */
  user: AuthUser | null;
  /** False during server rendering and the first client render (avoids a signed-out flash on reload). */
  ready: boolean;
  signInOpen: boolean;
  signInReason: string;
  openSignIn: (reason?: string) => void;
  closeSignIn: () => void;
  signInWithCredential: (credential: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "optipath_user";
const TOKEN_KEY = "optipath_token";

class RejectedSignIn extends Error {}

// ---- tiny external store over localStorage so React can read it without setState-in-effect ----
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function notify(): void {
  listeners.forEach((l) => l());
}

function readRawUser(): string | null {
  try {
    return localStorage.getItem(USER_KEY);
  } catch {
    return null;
  }
}

const subscribeNever = () => () => {};

// ---- helpers ----
interface JwtPayload {
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
  aud?: string;
  exp?: number;
}

function decodeJwtPayload(token: string): JwtPayload {
  const part = token.split(".")[1];
  if (!part) throw new Error("Malformed sign-in token.");
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(b64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(json) as JwtPayload;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function normalizeUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const first = str(r.firstName) || str(r.given_name);
  const last = str(r.lastName) || str(r.family_name);
  const name = str(r.name) || str(r.fullName) || [first, last].filter(Boolean).join(" ");
  const email = str(r.email);
  if (!name && !email) return null;
  const display = name || email;
  return {
    name: display,
    firstName: first || display.split(" ")[0],
    email,
    picture: str(r.picture) || undefined,
  };
}

function parseStoredUser(raw: string | null): AuthUser | null {
  if (!raw) return null;
  try {
    return normalizeUser(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const rawUser = useSyncExternalStore(subscribe, readRawUser, () => null);
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);
  const user = useMemo(() => parseStoredUser(rawUser), [rawUser]);

  const [signInOpen, setSignInOpen] = useState(false);
  const [signInReason, setSignInReason] = useState("");

  const openSignIn = useCallback((reason?: string) => {
    setSignInReason(reason || "");
    setSignInOpen(true);
  }, []);

  const closeSignIn = useCallback(() => setSignInOpen(false), []);

  const signInWithCredential = useCallback(async (credential: string) => {
    // 1. Read what Google says about the user.
    const payload = decodeJwtPayload(credential);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
      throw new RejectedSignIn("Sign-in expired. Please try again.");
    }
    if (clientId && payload.aud && payload.aud !== clientId) {
      throw new RejectedSignIn("Sign-in was issued for a different application.");
    }
    let nextUser = normalizeUser(payload);
    if (!nextUser) throw new RejectedSignIn("Google did not return a name or email.");

    // 2. Best-effort backend verification. If the backend is unreachable we keep the
    //    Google identity (it only unlocks UI; no student records depend on it).
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      const res = await fetch(`${API_URL}/auth/google-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data: unknown = await res.json();
        const d = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
        if (typeof d.access_token === "string") localStorage.setItem(TOKEN_KEY, d.access_token);
        const fromServer = normalizeUser(d.user);
        if (fromServer) nextUser = { ...nextUser, ...fromServer, picture: fromServer.picture || nextUser.picture };
      } else if (res.status >= 400 && res.status < 500) {
        let detail = "Sign-in was rejected by the server.";
        try {
          const err: unknown = await res.json();
          const e = (err && typeof err === "object" ? err : {}) as Record<string, unknown>;
          if (typeof e.detail === "string") detail = e.detail;
        } catch {
          // keep the default message
        }
        throw new RejectedSignIn(detail);
      }
      // 5xx: server problem, keep the Google identity
    } catch (e) {
      if (e instanceof RejectedSignIn) throw e;
      // network error or timeout: keep the Google identity
    }

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    notify();
    setSignInOpen(false);
  }, []);

  const signOut = useCallback(() => {
    try {
      googleLogout();
    } catch {
      // ignore
    }
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    notify();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready, signInOpen, signInReason, openSignIn, closeSignIn, signInWithCredential, signOut }),
    [user, ready, signInOpen, signInReason, openSignIn, closeSignIn, signInWithCredential, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
