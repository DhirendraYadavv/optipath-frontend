// lib/recruiterStore.ts
// The verified-recruiter session in localStorage (`optipath_recruiter`), read through useSyncExternalStore
// so pages react to it without setting state inside effects.
// This session only decides what the UI shows. The backend must check the token on every /talent/search call.

import { useMemo, useSyncExternalStore } from "react";
import { RECRUITER_STORAGE_KEY, RecruiterSession, parseRecruiterSession } from "@/lib/talentPool";

const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const notify = () => listeners.forEach((l) => l());

function readRaw(): string | null {
  try {
    return localStorage.getItem(RECRUITER_STORAGE_KEY);
  } catch {
    return null;
  }
}

const subscribeNever = () => () => {};

export function saveRecruiterSession(s: RecruiterSession): void {
  try {
    localStorage.setItem(RECRUITER_STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* storage blocked: the session simply will not persist */
  }
  notify();
}

export function clearRecruiterSession(): void {
  try {
    localStorage.removeItem(RECRUITER_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  notify();
}

export function useRecruiterSession(): { ready: boolean; session: RecruiterSession | null } {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);
  const session = useMemo(() => parseRecruiterSession(raw), [raw]);
  return { ready, session };
}
