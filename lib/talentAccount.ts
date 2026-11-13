// The signed-in owner's own Talent Pool entry: look it up and delete it.
// Pure helpers (fetch is passed in) so they are unit-tested without a browser.

export const GOOGLE_TOKEN_KEY = "optipath_token";

export function readGoogleToken(): string | null {
  try {
    return localStorage.getItem(GOOGLE_TOKEN_KEY);
  } catch {
    return null;
  }
}

export interface PoolEntry {
  inPool: boolean;
  targetRole?: string;
  uploadedAt?: string;
}

export type PoolResult<T> = { ok: true; value: T } | { ok: false; message: string };

type FetchLike = (url: string, init: { method?: string; headers: Record<string, string>; signal?: AbortSignal }) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

const SIGN_IN_AGAIN = "Please sign out and sign in with Google again, then retry.";

function failureMessage(status: number, what: string): string {
  if (status === 401 || status === 403) return SIGN_IN_AGAIN;
  if (status >= 500) return `The Talent Pool service had a problem. ${what} Please try again shortly.`;
  return `The server did not accept this. ${what}`;
}

export function parsePoolEntry(raw: unknown): PoolEntry {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  if (r.inPool !== true) return { inPool: false };
  return {
    inPool: true,
    targetRole: typeof r.targetRole === "string" ? r.targetRole : undefined,
    uploadedAt: typeof r.uploadedAt === "string" ? r.uploadedAt : undefined,
  };
}

async function call<T>(f: FetchLike, url: string, method: "GET" | "DELETE", token: string | null, what: string, read: (body: unknown) => T): Promise<PoolResult<T>> {
  if (!token) return { ok: false, message: "Sign in with Google first." };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await f(url, { method, headers: { Authorization: `Bearer ${token}` }, signal: controller.signal });
    if (!res.ok) return { ok: false, message: failureMessage(res.status, what) };
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    return { ok: true, value: read(body) };
  } catch {
    return { ok: false, message: `Could not reach the Talent Pool service. ${what}` };
  } finally {
    clearTimeout(timer);
  }
}

export function fetchMyEntry(f: FetchLike, url: string, token: string | null): Promise<PoolResult<PoolEntry>> {
  return call(f, url, "GET", token, "Nothing was changed.", parsePoolEntry);
}

export function deleteMyEntry(f: FetchLike, url: string, token: string | null): Promise<PoolResult<{ removed: boolean }>> {
  return call(f, url, "DELETE", token, "Your resume was not removed.", (b) => ({ removed: !!(b && typeof b === "object" && (b as Record<string, unknown>).removed === true) }));
}
