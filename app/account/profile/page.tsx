'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '../../../components/AuthContext';

const inputCls =
  'w-full border-2 border-paper-200 bg-white px-4 py-3 font-pt text-body text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-brand-blue';
const labelCls = 'mb-1.5 block font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const dirty = !!user && (name !== user.name || email !== user.email || phone !== user.phone);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const res = updateUser({ name, email, phone });
    setStatus(res.ok ? { type: 'ok', msg: 'Your details have been saved.' } : { type: 'error', msg: res.error ?? 'Could not save.' });
  }

  return (
    <div>
      <header className="mb-6">
        <h2 className="font-quantico text-display-md font-bold uppercase tracking-tight text-ink">Profile</h2>
        <p className="mt-1 font-pt text-body text-fg-muted">Manage the details on your 10X account.</p>
      </header>

      <form onSubmit={onSubmit} className="max-w-xl space-y-5 border border-paper-200 bg-white p-6 shadow-card md:p-8">
        <div>
          <label htmlFor="name" className={labelCls}>Full name</label>
          <input id="name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input id="phone" type="tel" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+91 …" />
        </div>

        {status && (
          <p role="status" className={`font-pt text-body-sm ${status.type === 'ok' ? 'text-success' : 'text-danger'}`}>
            {status.msg}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={!dirty} className="cursor-pointer bg-accent px-7 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40">
            Save changes
          </button>
          {dirty && (
            <button type="button" onClick={() => { if (user) { setName(user.name); setEmail(user.email); setPhone(user.phone); setStatus(null); } }} className="cursor-pointer px-3 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-fg-muted transition-colors hover:text-ink">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
