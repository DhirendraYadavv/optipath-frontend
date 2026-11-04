"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { googleLogout } from "@react-oauth/google";

export interface AuthUser {
  name: string;
  firstName: string;
  email: string;
  picture?: string;
}

interface AuthContextValue {
  /** The signed-in Google user, or null. */
  user: AuthUser | null;
  /** False until localStorage has been read (avoids a signed-out flash on reload). */
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
const API_URL = "http://localhost:8000";

class RejectedSignIn extends Error {}

function decodeJwtPayload(token: string): any {
  const part = token.split(".")[1];
  if (!part) throw new Error("Malformed sign-in token.");
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(b64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(json);
}

function normalizeUser(raw: any): AuthUser | null {
  if (!raw || typeof raw !== "object") return null;
  const name: string =
    raw.name || raw.fullName || [raw.firstName || raw.given_name, raw.lastName || raw.family_name].filter(Boolean).join(" ") || "";
  const email: string = raw.email || "";
  if (!name && !email) return null;
  const display = name || email;
  return {
    name: display,
    firstName: raw.firstName || raw.given_name || display.split(" ")[0],
    email,
    picture: raw.picture || undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInReason, setSignInReason] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) setUser(normalizeUser(JSON.parse(saved)));
    } catch {
      // corrupted value: treat as signed out
    }
    setReady(true);
  }, []);

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
        const data = await res.json();
        if (data.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
        const fromServer = normalizeUser(data.user);
        if (fromServer) nextUser = { ...nextUser, ...fromServer, picture: fromServer.picture || nextUser.picture };
      } else if (res.status >= 400 && res.status < 500) {
        let detail = "Sign-in was rejected by the server.";
        try {
          const err = await res.json();
          if (err?.detail && typeof err.detail === "string") detail = err.detail;
        } catch {}
        throw new RejectedSignIn(detail);
      }
      // 5xx: server problem, keep the Google identity
    } catch (e) {
      if (e instanceof RejectedSignIn) throw e;
      // network error or timeout: keep the Google identity
    }

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setSignInOpen(false);
  }, []);

  const signOut = useCallback(() => {
    try {
      googleLogout();
    } catch {}
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
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
