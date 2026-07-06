'use client';

import { useEffect, useRef, type RefObject } from 'react';

// Continuous marquee-style auto-scroll for a horizontal track whose content
// is rendered twice (originals + duplicates). `wrapIndex` is the child index
// where the duplicate set begins — scrolling wraps there so the loop is
// seamless. Pauses while the user hovers or touches the track.
export function useAutoScroll(
  ref: RefObject<HTMLElement | null>,
  { speed = 0.6, wrapIndex }: { speed?: number; wrapIndex: number },
) {
  const paused = useRef(false);
  const pos = useRef(0);
  const resumeTimer = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    pos.current = el.scrollLeft;
    let raf = 0;

    const tick = () => {
      if (!paused.current) {
        const first = el.children[0] as HTMLElement | undefined;
        const dup = el.children[wrapIndex] as HTMLElement | undefined;
        const wrapAt = first && dup ? dup.offsetLeft - first.offsetLeft : 0;
        pos.current += speed;
        if (wrapAt > 0 && pos.current >= wrapAt) pos.current -= wrapAt;
        el.scrollLeft = pos.current;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => {
      paused.current = true;
    };
    const resume = () => {
      pos.current = el.scrollLeft;
      paused.current = false;
    };
    // Keep our float position in sync while the user drags the track.
    const sync = () => {
      if (paused.current) pos.current = el.scrollLeft;
    };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);
    el.addEventListener('touchcancel', resume);
    el.addEventListener('scroll', sync, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimer.current);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      el.removeEventListener('touchcancel', resume);
      el.removeEventListener('scroll', sync);
    };
  }, [ref, speed, wrapIndex]);

  // For arrow buttons: smooth-scroll a step, then resume the marquee.
  function scrollByAmount(delta: number) {
    const el = ref.current;
    if (!el) return;
    paused.current = true;
    el.scrollBy({ left: delta, behavior: 'smooth' });
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      pos.current = el.scrollLeft;
      paused.current = false;
    }, 700);
  }

  return { scrollByAmount };
}
