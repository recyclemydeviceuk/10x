'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type AuthUser = {
  name: string;
  email: string;
  phone: string;
};

type RegisterInput = AuthUser & { password: string };
type AuthResult = { ok: boolean; error?: string };

type AuthContextValue = {
  isLoggedIn: boolean | null;
  user: AuthUser | null;
  login: (email: string) => AuthResult;
  register: (data: RegisterInput) => AuthResult;
  logout: () => void;
};

const AUTH_FLAG = '10x:auth';
const CURRENT_USER = '10x:auth:user';
const USERS_DB = '10x:users';

const AuthContext = createContext<AuthContextValue | null>(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,}$/;

function readUsers(): RegisterInput[] {
  try {
    const raw = window.localStorage.getItem(USERS_DB);
    return raw ? (JSON.parse(raw) as RegisterInput[]) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loggedIn = window.localStorage.getItem(AUTH_FLAG) === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      try {
        const raw = window.localStorage.getItem(CURRENT_USER);
        if (raw) setUser(JSON.parse(raw));
      } catch {
        // ignore
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_FLAG) {
        setIsLoggedIn(event.newValue === 'true');
      }
      if (event.key === CURRENT_USER) {
        if (event.newValue) {
          try {
            setUser(JSON.parse(event.newValue));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = useCallback((email: string): AuthResult => {
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) {
      return { ok: false, error: 'Enter a valid email address.' };
    }
    const users = readUsers();
    const match = users.find((u) => u.email.toLowerCase() === normalized);

    const session: AuthUser = match
      ? { name: match.name, email: match.email, phone: match.phone }
      : { name: normalized.split('@')[0], email: normalized, phone: '' };

    window.localStorage.setItem(AUTH_FLAG, 'true');
    window.localStorage.setItem(CURRENT_USER, JSON.stringify(session));
    setIsLoggedIn(true);
    setUser(session);
    return { ok: true };
  }, []);

  const register = useCallback((data: RegisterInput): AuthResult => {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.trim();
    const password = data.password;

    if (!name) return { ok: false, error: 'Name is required.' };
    if (!EMAIL_RE.test(email))
      return { ok: false, error: 'Enter a valid email address.' };
    if (!PHONE_RE.test(phone))
      return { ok: false, error: 'Enter a valid phone number.' };
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' };
    }

    try {
      const users = readUsers();
      if (users.some((u) => u.email.toLowerCase() === email)) {
        return {
          ok: false,
          error: 'An account with this email already exists.',
        };
      }
      const record: RegisterInput = { name, email, phone, password };
      users.push(record);
      window.localStorage.setItem(USERS_DB, JSON.stringify(users));

      const session: AuthUser = { name, email, phone };
      window.localStorage.setItem(AUTH_FLAG, 'true');
      window.localStorage.setItem(CURRENT_USER, JSON.stringify(session));
      setIsLoggedIn(true);
      setUser(session);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Something went wrong. Try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_FLAG);
    window.localStorage.removeItem(CURRENT_USER);
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    isLoggedIn,
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
