'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { api, firstMessage } from '@/lib/api/storefront';
import type { Address, Customer, SignupInput } from '@/lib/store/types';

/**
 * Storefront auth — email + password, against the 10X API.
 *
 * The session is an HttpOnly backend cookie. Nothing here can read a token or
 * stores or compares a password.
 *
 * Every failure comes back as a message rather than an exception, because the
 * callers are forms.
 */

/** Shortest password the UI will accept. Kept in step with the API. */
export const MIN_PASSWORD = 8;

type AuthResult = { ok: true } | { ok: false; message: string };

/** What the API returns for a customer. */
type ApiCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  addresses: ApiAddress[];
  marketingOptIn: boolean;
  joinedAt: string;
  hasSubscription: boolean;
};

export type ApiAddress = {
  _id?: string;
  label: string;
  fullName: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
};

type AuthContextValue = {
  customer: Customer | null;
  /** The address book as the API stores it — the account pages map it. */
  addresses: Address[];
  /** True until the stored session has been read — guards a logged-out flash. */
  loading: boolean;
  isAuthed: boolean;
  signup: (input: SignupInput) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  /** Always resolves ok — the response must not reveal who has an account. */
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  /** Send an OTP to a new address to prove the customer owns it. */
  requestEmailChange: (newEmail: string) => Promise<AuthResult>;
  /** Swap the account over once that OTP checks out. */
  confirmEmailChange: (newEmail: string, code: string) => Promise<AuthResult>;
  /** Set a new password from an emailed reset token. */
  resetPassword: (token: string, next: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateProfile: (patch: { name?: string; phone?: string; marketingOptIn?: boolean }) => Promise<AuthResult>;
  /** Upload or remove the S3-backed profile photo. */
  setAvatar: (file: File | null) => Promise<AuthResult>;
  /**
   * Replace the whole address book. Returns the saved book, because the
   * server is what assigns the ids — a caller that just added an address
   * needs the real one to select it.
   */
  saveAddresses: (addresses: Address[]) => Promise<AuthResult & { addresses?: Address[] }>;
  /** Re-read the profile — after an order changes subscription state, say. */
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/* ------------------------------------------------------------- mapping */

export function toUiAddress(a: ApiAddress, index: number, fallbackName: string, fallbackPhone: string): Address {
  return {
    id: a._id ?? `addr_${index}`,
    label: a.label || 'Home',
    fullName: a.fullName || fallbackName,
    phone: a.phone || fallbackPhone,
    house: a.line1,
    street: a.line2,
    landmark: a.landmark || undefined,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    isDefault: a.isDefault,
  };
}

export function toApiAddress(a: Address): ApiAddress {
  return {
    label: a.label || 'Home',
    fullName: a.fullName,
    line1: a.house,
    line2: a.street,
    landmark: a.landmark ?? '',
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    phone: a.phone,
    isDefault: a.isDefault,
  };
}

/* ------------------------------------------------------------ provider */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ApiCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const adopt = useCallback((next: ApiCustomer | null) => setProfile(next), []);

  const load = useCallback(async () => {
    const result = await api<{ customer: ApiCustomer }>('/api/v1/auth/me');
    if (result.ok) {
      adopt(result.data.customer);
    } else if (result.status === 401) {
      adopt(null);
    }
    // Any other failure (the API is down) keeps the current state: a network
    // blip shouldn't log someone out.
  }, [adopt]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  // The API layer raises this on any 401 from a signed-in call. Drop the
  // profile so the UI stops pretending, and re-check when the tab comes back
  // (a cookie that expired while the laptop was closed is noticed at once).
  useEffect(() => {
    const expired = () => adopt(null);
    const revisit = () => {
      if (document.visibilityState === 'visible') void load();
    };
    window.addEventListener('10x:session-expired', expired);
    document.addEventListener('visibilitychange', revisit);
    return () => {
      window.removeEventListener('10x:session-expired', expired);
      document.removeEventListener('visibilitychange', revisit);
    };
  }, [adopt, load]);

  /* --------------------------------------------------------------- auth */

  const signup = useCallback(
    async (input: SignupInput): Promise<AuthResult> => {
      const result = await api<{ customer: ApiCustomer }>('/api/v1/auth/register', {
        method: 'POST',
        auth: false,
        body: {
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          password: input.password,
        },
      });
      if (!result.ok) return { ok: false, message: firstMessage(result) };
      adopt(result.data.customer);
      return { ok: true };
    },
    [adopt],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const result = await api<{ customer: ApiCustomer }>('/api/v1/auth/login', {
        method: 'POST',
        auth: false,
        body: { email: email.trim().toLowerCase(), password },
      });
      if (!result.ok) {
        // One message for every credential failure. Saying "no such account"
        // would turn the form into a tool for discovering who has one.
        return {
          ok: false,
          message: result.status === 401 ? 'Email or password is incorrect.' : firstMessage(result),
        };
      }
      adopt(result.data.customer);
      return { ok: true };
    },
    [adopt],
  );

  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return { ok: false, message: 'Enter a valid email address.' };
    }
    // The API answers the same way whether or not the address is on file.
    const result = await api('/api/v1/auth/forgot-password', {
      method: 'POST',
      auth: false,
      body: { email: email.trim().toLowerCase() },
    });
    return result.ok ? { ok: true } : { ok: false, message: firstMessage(result) };
  }, []);

  const resetPassword = useCallback(async (token: string, next: string): Promise<AuthResult> => {
    if (!token) return { ok: false, message: 'This reset link is invalid or has expired.' };
    if (next.length < MIN_PASSWORD) {
      return { ok: false, message: `Password must be at least ${MIN_PASSWORD} characters.` };
    }
    const result = await api('/api/v1/auth/reset-password', {
      method: 'POST',
      auth: false,
      body: { token, password: next },
    });
    return result.ok ? { ok: true } : { ok: false, message: firstMessage(result) };
  }, []);

  const requestEmailChange = useCallback(async (newEmail: string): Promise<AuthResult> => {
    const result = await api('/api/v1/auth/email/request', {
      method: 'POST',
      body: { email: newEmail.trim().toLowerCase() },
    });
    return result.ok ? { ok: true } : { ok: false, message: firstMessage(result) };
  }, []);

  const confirmEmailChange = useCallback(
    async (newEmail: string, code: string): Promise<AuthResult> => {
      const result = await api<{ customer: ApiCustomer }>('/api/v1/auth/email/confirm', {
        method: 'POST',
        body: { email: newEmail.trim().toLowerCase(), code: code.trim() },
      });
      if (!result.ok) return { ok: false, message: firstMessage(result) };
      adopt(result.data.customer);
      return { ok: true };
    },
    [adopt],
  );

  const signOut = useCallback(async () => {
    adopt(null);
    // Awaited by callers before navigating — the server clears the session
    // AND the cart cookie in this call, so the next person on this browser
    // doesn't inherit either.
    await api('/api/v1/auth/logout', { method: 'POST', auth: false });
  }, [adopt]);

  /* ------------------------------------------------------------ profile */

  const updateProfile = useCallback(
    async (patch: { name?: string; phone?: string; marketingOptIn?: boolean }): Promise<AuthResult> => {
      const result = await api<{ customer: ApiCustomer }>('/api/v1/auth/me', {
        method: 'PATCH',
        body: patch,
      });
      if (!result.ok) return { ok: false, message: firstMessage(result) };
      adopt(result.data.customer);
      return { ok: true };
    },
    [adopt],
  );

  const setAvatar = useCallback(
    async (file: File | null): Promise<AuthResult> => {
      let result;
      if (file) {
        const form = new FormData();
        form.append('file', file);
        result = await api<{ customer: ApiCustomer }>('/api/v1/auth/me/avatar', { method: 'POST', form });
      } else {
        result = await api<{ customer: ApiCustomer }>('/api/v1/auth/me/avatar', { method: 'DELETE' });
      }
      if (!result.ok) return { ok: false, message: firstMessage(result) };
      adopt(result.data.customer);
      return { ok: true };
    },
    [adopt],
  );

  const saveAddresses = useCallback(
    async (next: Address[]): Promise<AuthResult & { addresses?: Address[] }> => {
      const result = await api<{ customer: ApiCustomer }>('/api/v1/auth/me', {
        method: 'PATCH',
        body: { addresses: next.map(toApiAddress) },
      });
      if (!result.ok) return { ok: false, message: firstMessage(result) };
      const saved = result.data.customer;
      adopt(saved);
      return {
        ok: true,
        addresses: saved.addresses.map((a, i) => toUiAddress(a, i, saved.name, saved.phone)),
      };
    },
    [adopt],
  );

  /* -------------------------------------------------------------- value */

  const customer: Customer | null = useMemo(
    () =>
      profile
        ? {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            avatarUrl: profile.avatarUrl || null,
            joinedAt: profile.joinedAt,
          }
        : null,
    [profile],
  );

  const addresses: Address[] = useMemo(
    () =>
      profile
        ? profile.addresses.map((a, i) => toUiAddress(a, i, profile.name, profile.phone))
        : [],
    [profile],
  );

  const value = useMemo(
    () => ({
      customer,
      addresses,
      loading,
      isAuthed: customer !== null,
      signup,
      login,
      requestPasswordReset,
      requestEmailChange,
      confirmEmailChange,
      resetPassword,
      signOut,
      updateProfile,
      setAvatar,
      saveAddresses,
      refresh: load,
    }),
    [
      customer, addresses, loading, signup, login, requestPasswordReset, requestEmailChange,
      confirmEmailChange, resetPassword, signOut, updateProfile, setAvatar, saveAddresses, load,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
