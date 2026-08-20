// =========================================================
// 10X STOREFRONT — the one way this app talks to the API.
//
// Safe on both sides of the render boundary: no secrets. Browser sessions are
// HttpOnly cookies issued by the API; no authentication token is available to
// browser JavaScript.
//
// Every call returns a discriminated result instead of throwing,
// because most callers are forms that need to render the
// message rather than crash the page.
// =========================================================

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

/* -------------------------------------------------------------- request */

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; message: string; details?: Record<string, string> };

type Options = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  /** JSON body. Ignored when `form` is set. */
  body?: unknown;
  /** Multipart body — used by the return-request upload. */
  form?: FormData;
  /** Kept for call-site compatibility; authentication is cookie-based. */
  auth?: boolean;
  /** Next.js cache hint for server-side calls. */
  revalidate?: number;
};

const UNREACHABLE = 'We can’t reach the store right now. Try again in a moment.';

export async function api<T = Record<string, unknown>>(
  path: string,
  options: Options = {},
): Promise<ApiResult<T>> {
  const { method = 'GET', body, form, auth = true, revalidate } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  // Never set Content-Type for FormData — the browser adds the boundary.
  if (body !== undefined && !form) headers['Content-Type'] = 'application/json';
  void auth;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      ...(form ? { body: form } : body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...(revalidate !== undefined ? { next: { revalidate } } : { cache: 'no-store' as RequestCache }),
    });
  } catch {
    return { ok: false, status: 503, message: UNREACHABLE };
  }

  const text = await response.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    // The API answers { ok: false, message } and, for a validation failure,
    // an `issues` array naming the fields. Fold that into `details` so a form
    // can put each message next to the input it belongs to.
    const issues = Array.isArray(payload.issues)
      ? (payload.issues as { path?: string; message?: string }[])
      : [];
    const details = issues.length
      ? Object.fromEntries(
          issues
            .filter((i) => i.path && i.message)
            .map((i) => [String(i.path).split('.').pop() as string, i.message as string]),
        )
      : undefined;

    return {
      ok: false,
      status: response.status,
      message: (payload.message as string) ?? 'Something went wrong.',
      details,
    };
  }

  return { ok: true, status: response.status, data: payload as T };
}

/** The first field-level error, or the general message — what a form shows. */
export function firstMessage(result: Extract<ApiResult<unknown>, { ok: false }>): string {
  const detail = result.details ? Object.values(result.details)[0] : undefined;
  return detail ?? result.message;
}
