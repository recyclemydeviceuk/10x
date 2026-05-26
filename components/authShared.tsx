import type { CSSProperties, ReactNode } from 'react';

export const authInputClass =
  'w-full border-2 border-paper-200 bg-white px-4 py-3 font-pt text-body text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-brand-blue';

export const authButtonStyle: CSSProperties = {
  background: 'linear-gradient(90deg, #000204 0%, #02063A 35%, #06189E 100%)',
};

export function AuthField({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block font-quantico text-[11px] font-bold uppercase tracking-widest text-fg-muted"
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 font-pt text-caption text-fg-subtle">{hint}</p>
      )}
    </div>
  );
}

export function AuthSuccessCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-accent text-ink">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12.5 10 17.5 19 7" />
        </svg>
      </div>
      <h2 className="font-condensed text-[1.25rem] font-black uppercase text-fg">
        {title}
      </h2>
      <p className="mt-2 font-pt text-body-sm text-fg-muted">{subtitle}</p>
    </div>
  );
}
