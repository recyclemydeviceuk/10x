import type { Metadata } from 'next';

import LoginForm from './LoginForm';

export const metadata: Metadata = {
  // Absolute so the storefront's "%s | 10X" template doesn't append to it.
  title: { absolute: 'Sign in — 10X Admin' },
  robots: { index: false, follow: false },
};

/**
 * Split screen: the brand holds the left half, the work happens on the right.
 * Below `lg` the ink panel collapses to a slim header so the form owns the
 * viewport.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Brand half */}
      <section className="flex flex-col justify-between bg-ink px-8 py-8 text-white sm:px-12 lg:w-[46%] lg:px-16 lg:py-14">
        <div className="flex items-baseline gap-3">
          <span className="font-quantico text-2xl font-bold italic tracking-tight">10X</span>
          <span className="font-nebula text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            Admin
          </span>
        </div>

        <div className="hidden lg:block">
          <p className="font-nebula text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            The Brain Battery
          </p>
          <h1 className="mt-5 font-quantico text-[3.25rem] font-bold uppercase italic leading-[0.92] tracking-[-0.04em]">
            Fuel Better
            <br />
            Thinking.
          </h1>
          <p className="type-b1 mt-6 max-w-sm text-white/60">
            Orders, customers, subscriptions and payments — one place, synced
            with Shiprocket and Razorpay.
          </p>
        </div>

        <p className="hidden font-nebula text-[10px] uppercase tracking-[0.16em] text-white/30 lg:block">
          © 2026 10X Formulas
        </p>
      </section>

      {/* Form half */}
      <section className="flex flex-1 items-center justify-center px-6 py-14 sm:px-12 lg:py-16">
        <div className="w-full max-w-[380px]">
          <h2 className="font-quantico text-2xl font-bold uppercase tracking-[0.01em] text-ink">
            Sign in
          </h2>
          <p className="type-b2 mt-2 text-fg-muted">
            Admin access only. Sessions expire after eight hours.
          </p>

          <LoginForm next={next} />
        </div>
      </section>
    </div>
  );
}
