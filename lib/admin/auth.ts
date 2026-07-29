/**
 * Admin session tokens.
 *
 * Deliberately dependency-free and built on Web Crypto so the exact same code
 * runs in middleware (edge runtime) and in server actions (node) — the session
 * is verified in one place, not reimplemented per runtime.
 *
 * The token is `base64url(payload).base64url(hmac)`. It is signed, NOT
 * encrypted: never put anything in the payload you wouldn't show the user.
 *
 * Swapping the env-var credential check in `verifyCredentials` for a real user
 * table is the only change needed to move this to a database — nothing else in
 * the panel reads credentials.
 */

const encoder = new TextEncoder();

/** Eight hours. Long enough for a working day, short enough to matter. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export const SESSION_COOKIE = '10x_admin_session';

export type AdminSession = {
  /** Stable id for the admin user. */
  sub: string;
  email: string;
  name: string;
  role: 'owner' | 'staff';
  /** Unix seconds. */
  exp: number;
};

/* ---------------------------------------------------------------- helpers */

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, '='));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/** Constant-time comparison — never short-circuit on the first wrong byte. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === 'production') {
    // Refusing here is the point: an unsigned-in-practice session is worse
    // than a panel that won't open.
    throw new Error(
      'ADMIN_SESSION_SECRET is missing or too short (min 16 chars). Set it before deploying the admin panel.',
    );
  }
  return 'dev-only-insecure-session-secret';
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/* ---------------------------------------------------------------- tokens */

export async function signSession(
  session: Omit<AdminSession, 'exp'>,
  maxAgeSeconds = SESSION_MAX_AGE_SECONDS,
): Promise<string> {
  const payload: AdminSession = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Returns the session, or null for anything malformed, unsigned or expired. */
export async function verifySession(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  try {
    const expected = await crypto.subtle.sign('HMAC', await hmacKey(), encoder.encode(body));
    if (!safeEqual(signature, toBase64Url(new Uint8Array(expected)))) return null;

    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as AdminSession;
    if (typeof session.exp !== 'number' || session.exp * 1000 < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------ credentials */

/**
 * Checks a login against the configured admin credentials.
 *
 * Configure with `ADMIN_EMAIL` plus either `ADMIN_PASSWORD_SHA256` (preferred —
 * generate with `echo -n 'yourpassword' | shasum -a 256`) or `ADMIN_PASSWORD`.
 * Outside production, an unconfigured panel falls back to a dev login so the UI
 * can be worked on; in production an unconfigured panel refuses every login
 * rather than opening with a guessable default.
 */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<Omit<AdminSession, 'exp'> | null> {
  const isProd = process.env.NODE_ENV === 'production';
  const configuredEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_SHA256;
  const passwordPlain = process.env.ADMIN_PASSWORD;

  const expectedEmail = configuredEmail ?? (isProd ? null : 'admin@10xdrink.com');
  if (!expectedEmail) return null;

  let expectedHash: string | null = null;
  if (passwordHash) expectedHash = passwordHash.toLowerCase();
  else if (passwordPlain) expectedHash = await sha256Hex(passwordPlain);
  else if (!isProd) expectedHash = await sha256Hex('10xadmin');

  if (!expectedHash) return null;

  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase());
  const passwordOk = safeEqual(await sha256Hex(password), expectedHash);
  // Both are evaluated before branching so a wrong email and a wrong password
  // take the same time.
  if (!emailOk || !passwordOk) return null;

  return {
    sub: 'admin-1',
    email: expectedEmail,
    name: process.env.ADMIN_NAME ?? 'Store Admin',
    role: 'owner',
  };
}
