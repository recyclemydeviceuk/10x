/**
 * Sign-in codes for returning customers.
 *
 * IN-MEMORY, like the query store — codes live in the server process and are
 * gone on restart. That's fine for a code with a ten-minute life, but the real
 * gap is that NOTHING SENDS THE EMAIL YET. Until a mail provider is wired in,
 * `issueCode` returns the code to the caller so the flow can be used and
 * reviewed; the action only passes it to the browser outside production.
 *
 * Before this is live it needs: an email provider, and a shared store (Redis or
 * the database) so the code still verifies if a second instance handles it.
 */

type Entry = {
  code: string;
  expiresAt: number;
  attempts: number;
  /** Rate limit for resends. */
  lastSentAt: number;
};

const globalForOtp = globalThis as unknown as { __10xOtp?: Map<string, Entry> };

function store(): Map<string, Entry> {
  if (!globalForOtp.__10xOtp) globalForOtp.__10xOtp = new Map();
  return globalForOtp.__10xOtp;
}

export const CODE_LENGTH = 6;
const TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 30 * 1000;

function key(email: string): string {
  return email.trim().toLowerCase();
}

/** Six digits from a CSPRNG — never Math.random for anything that guards data. */
function generateCode(): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(bytes[0] % 10 ** CODE_LENGTH).padStart(CODE_LENGTH, '0');
}

export type IssueResult =
  | { ok: true; code: string; expiresInSeconds: number }
  | { ok: false; reason: 'cooldown'; retryInSeconds: number };

export function issueCode(email: string, now = Date.now()): IssueResult {
  const id = key(email);
  const existing = store().get(id);

  if (existing && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
    return {
      ok: false,
      reason: 'cooldown',
      retryInSeconds: Math.ceil((RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000),
    };
  }

  const code = generateCode();
  store().set(id, { code, expiresAt: now + TTL_MS, attempts: 0, lastSentAt: now });

  return { ok: true, code, expiresInSeconds: TTL_MS / 1000 };
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'expired' | 'mismatch' | 'locked' };

export function verifyCode(email: string, code: string, now = Date.now()): VerifyResult {
  const id = key(email);
  const entry = store().get(id);

  if (!entry || entry.expiresAt < now) {
    store().delete(id);
    return { ok: false, reason: 'expired' };
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store().delete(id);
    return { ok: false, reason: 'locked' };
  }

  entry.attempts += 1;

  // Constant-time-ish: compare every digit rather than bailing on the first.
  const supplied = code.trim();
  let diff = supplied.length ^ entry.code.length;
  for (let i = 0; i < Math.max(supplied.length, entry.code.length); i += 1) {
    diff |= (supplied.charCodeAt(i) || 0) ^ (entry.code.charCodeAt(i) || 0);
  }

  if (diff !== 0) return { ok: false, reason: 'mismatch' };

  // Single use.
  store().delete(id);
  return { ok: true };
}
