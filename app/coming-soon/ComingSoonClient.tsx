'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { API_URL } from '@/lib/api/storefront';

// =========================================================
// The coming-soon screen — a faithful replica of the original
// standalone build: battery video with a percentage counter
// synced to the fill animation, the "You charge everything."
// headline, and the early-access form. One change under the
// hood: signups land in OUR database (visible in the panel),
// not a third-party form service.
// =========================================================

/** Measured from the source clip: green fill rises ~0.15s → ~2.30s. */
const FILL_START = 0.15;
const FILL_END = 2.3;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ComingSoonClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [percent, setPercent] = useState(0);
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  /* Battery counter, synced to the video's own playback position. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let running = true;

    const tick = () => {
      const pct = Math.min(Math.max(((video.currentTime - FILL_START) / (FILL_END - FILL_START)) * 100, 0), 100);
      setPercent(Math.round(pct));
      if (pct >= 100) running = false;
      if (running) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const onEnded = () => {
      running = false;
      setPercent(100);
    };
    video.addEventListener('ended', onEnded);

    // Some mobile browsers block autoplay until the first interaction.
    const kick = () => {
      if (video.ended) return;
      void video.play().catch(() => {});
    };
    kick();
    document.addEventListener('touchstart', kick, { once: true });
    document.addEventListener('click', kick, { once: true });

    return () => {
      running = false;
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setInvalid(true);
      setMessage({ text: 'Please enter a valid email address.', error: true });
      return;
    }
    setInvalid(false);
    setSending(true);
    setMessage(null);

    const honeypot = (event.currentTarget.elements.namedItem('company') as HTMLInputElement | null)?.value ?? '';
    try {
      const res = await fetch(`${API_URL}/api/v1/signups`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: value, company: honeypot }),
      });
      if (res.ok) {
        setMessage({ text: "You're on the list. We'll be in touch.", error: false });
        setEmail('');
      } else {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setMessage({ text: body.message ?? 'Something went wrong. Please try again.', error: true });
      }
    } catch {
      setMessage({ text: 'Network error — please check your connection and try again.', error: true });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-white text-[#111]">
      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:py-12">
        <div className="flex w-full max-w-[1120px] flex-col items-center justify-center gap-10 min-[781px]:flex-row min-[900px]:gap-24 min-[781px]:gap-14">
          {/* Battery */}
          <div className="shrink-0 text-center">
            <video
              ref={videoRef}
              className="mx-auto block w-[175px] min-[401px]:w-[190px] min-[781px]:w-[230px]"
              src="https://res.cloudinary.com/dn2sab6qc/video/upload/v1786565718/Battery_nj8iab.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              aria-hidden
            />
            <p className="mt-1 hidden text-[26px] font-bold tracking-[0.02em] tabular-nums min-[781px]:block">
              {percent}%
            </p>
          </div>

          {/* Copy + form */}
          <div className="w-full max-w-[520px] min-[781px]:max-w-[560px]">
            <h1 className="text-[clamp(38px,11vw,54px)] font-bold uppercase leading-[0.98] tracking-[-0.005em] min-[781px]:text-[clamp(44px,5.2vw,76px)]">
              You charge
              <br />
              <span className="text-[#63d42b]">everything.</span>
            </h1>

            <p className="mt-[26px] text-[15px] leading-[1.5] text-[#8a8a8a] min-[401px]:text-base min-[781px]:text-[clamp(16px,1.35vw,20px)]">
              Your phone has a battery. Your laptop has a battery.
              <br className="hidden min-[781px]:inline" />{' '}
              <strong className="font-semibold text-[#111]">Why not your brain?</strong>
            </p>

            <form className="mt-[26px] flex flex-col items-start gap-4 min-[781px]:flex-row min-[781px]:items-stretch" onSubmit={submit} noValidate>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInvalid(false);
                  if (message?.error) setMessage(null);
                }}
                placeholder="Your email"
                autoComplete="email"
                aria-label="Your email"
                required
                className={`w-full min-w-0 flex-none rounded-xl border bg-white px-[22px] py-[18px] text-[17px] text-[#111] shadow-[0_2px_10px_rgba(0,0,0,0.04)] outline-none transition-[border-color,box-shadow] duration-[180ms] placeholder:text-[#b3b3b3] min-[781px]:w-auto min-[781px]:flex-1 ${
                  invalid
                    ? 'border-[#e03b3b] shadow-[0_0_0_3px_rgba(224,59,59,0.13)]'
                    : 'border-[#e6e6e6] focus:border-[#12b34a] focus:shadow-[0_0_0_3px_rgba(18,179,74,0.15)]'
                }`}
              />

              {/* Spam trap: bots fill it, humans never see it. */}
              <input
                className="pointer-events-none absolute left-[-9999px] h-px w-px opacity-0"
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />

              <button
                type="submit"
                disabled={sending}
                className="shrink-0 cursor-pointer whitespace-nowrap rounded-xl border-none bg-[#12b34a] px-7 py-4 text-base font-semibold text-white transition-[background,transform] duration-[180ms] hover:bg-[#0e9c40] active:translate-y-px disabled:cursor-default disabled:opacity-65 min-[781px]:px-[30px] min-[781px]:py-[18px]"
              >
                {sending ? 'Sending…' : (
                  <>
                    Get early access <span aria-hidden>&rarr;</span>
                  </>
                )}
              </button>
            </form>

            <p
              role="status"
              aria-live="polite"
              className={`mt-3.5 min-h-5 text-[15px] font-medium ${message?.error ? 'text-[#e03b3b]' : 'text-[#12b34a]'}`}
            >
              {message?.text ?? ''}
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#e6e6e6] px-6 py-[22px]">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-3.5 min-[641px]:flex-row min-[641px]:items-center min-[641px]:justify-between min-[641px]:gap-x-8">
          <p className="text-[13px] leading-[1.6] text-[#8a8a8a]">
            &copy; 2026 10X. All rights reserved.
            <span className="block text-xs uppercase tracking-[0.04em] text-[#b3b3b3]">
              Tenex Formulas Private Limited
            </span>
          </p>

          <nav className="flex flex-wrap items-center gap-x-[22px] gap-y-2" aria-label="Legal">
            {[
              { href: '/terms', label: 'Terms & Conditions' },
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/refunds', label: 'Refund & Cancellation' },
              { href: '/shipping', label: 'Shipping Policy' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-[#8a8a8a] no-underline transition-colors duration-[180ms] hover:text-[#12b34a]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
