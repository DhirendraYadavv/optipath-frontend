import test from "node:test";
import assert from "node:assert/strict";
import { GOOGLE_TOKEN_KEY, deleteMyEntry, fetchMyEntry, parsePoolEntry } from "@/lib/talentAccount";

type Init = { method?: string; headers: Record<string, string>; signal?: AbortSignal };
const reply = (status: number, body: unknown) => async () => ({ ok: status >= 200 && status < 300, status, json: async () => body });

test("the Google token slot is the one the placement view and sign-in already use", () => {
  assert.equal(GOOGLE_TOKEN_KEY, "optipath_token");
});

test("parsePoolEntry only trusts an explicit inPool: true", () => {
  assert.deepEqual(parsePoolEntry({ inPool: false }), { inPool: false });
  assert.deepEqual(parsePoolEntry(null), { inPool: false });
  assert.deepEqual(parsePoolEntry({ inPool: "yes" }), { inPool: false });
  assert.deepEqual(parsePoolEntry({ inPool: true, targetRole: "Data Analyst", uploadedAt: "2026-11-12T01:00:00+00:00", extra: 1 }), { inPool: true, targetRole: "Data Analyst", uploadedAt: "2026-11-12T01:00:00+00:00" });
});

test("fetchMyEntry sends a GET with the Bearer token and parses the answer", async () => {
  let seen: { url: string; init: Init } | null = null;
  const f = async (url: string, init: Init) => {
    seen = { url, init };
    return { ok: true, status: 200, json: async () => ({ inPool: true, targetRole: "SDE 1" }) };
  };
  const r = await fetchMyEntry(f, "http://x/talent/me", "tok");
  assert.ok(r.ok && r.value.inPool && r.value.targetRole === "SDE 1");
  assert.equal(seen!.init.method, "GET");
  assert.equal(seen!.init.headers.Authorization, "Bearer tok");
});

test("deleteMyEntry sends DELETE and reports whether something was removed", async () => {
  let method = "";
  const f = async (_u: string, init: Init) => {
    method = init.method ?? "";
    return { ok: true, status: 200, json: async () => ({ status: "deleted", removed: true }) };
  };
  const r = await deleteMyEntry(f, "http://x/talent/me", "tok");
  assert.equal(method, "DELETE");
  assert.deepEqual(r, { ok: true, value: { removed: true } });
  const again = await deleteMyEntry(reply(200, { status: "deleted", removed: false }), "http://x", "tok");
  assert.deepEqual(again, { ok: true, value: { removed: false } });
});

test("no token means no request and a clear message", async () => {
  let called = false;
  const f = async () => {
    called = true;
    return { ok: true, status: 200, json: async () => ({}) };
  };
  const r = await deleteMyEntry(f, "http://x", null);
  assert.equal(called, false);
  assert.ok(!r.ok && /sign in with google/i.test(r.message));
});

test("401 asks for a fresh sign-in, 5xx says nothing was removed, network failure is explained", async () => {
  const a = await deleteMyEntry(reply(401, {}), "http://x", "t");
  assert.ok(!a.ok && /sign in with google again/i.test(a.message));
  const b = await deleteMyEntry(reply(503, {}), "http://x", "t");
  assert.ok(!b.ok && /not removed/i.test(b.message));
  const c = await deleteMyEntry(async () => { throw new Error("offline"); }, "http://x", "t");
  assert.ok(!c.ok && /could not reach/i.test(c.message) && /not removed/i.test(c.message));
});
