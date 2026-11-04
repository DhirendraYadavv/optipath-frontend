// lib/studentStore.ts
// Reads/writes the current candidate (SGT student or external) in localStorage through
// useSyncExternalStore, so pages can react to it without setting state inside effects.

import { useMemo, useSyncExternalStore } from "react";

const STUDENT_KEY = "optipath_student";
const TOKEN_KEY = "optipath_token";

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

function readRaw(): string | null {
  try {
    return localStorage.getItem(STUDENT_KEY);
  } catch {
    return null;
  }
}

const subscribeNever = () => () => {};

export function saveStudent(value: object): void {
  localStorage.setItem(STUDENT_KEY, JSON.stringify(value));
  notify();
}

export function clearStudent(): void {
  localStorage.removeItem(STUDENT_KEY);
  localStorage.removeItem(TOKEN_KEY);
  notify();
}

export function isExternalRecord(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return r.isExternal === true || (typeof r.registrationNo === "string" && r.registrationNo.startsWith("EXT-"));
}

/**
 * `ready` is false on the server and during the first client render.
 * `record` is the parsed object, or null when nothing (or something unreadable) is stored.
 */
export function useStoredStudent(): { ready: boolean; record: Record<string, unknown> | null } {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);
  const record = useMemo(() => {
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }, [raw]);
  return { ready, record };
}
