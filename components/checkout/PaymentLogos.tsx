/**
 * Accepted payment marks.
 *
 * Each logo sits on a white chip in BOTH themes. That isn't a style choice —
 * card-scheme trademark guidelines require the marks to appear unmodified on a
 * light background, so they can't be inverted, tinted or knocked out for dark
 * mode the way the rest of the UI is.
 *
 * The files in /public/payments are stand-ins (see the note in each SVG).
 * Swap them for the official assets before launch; nothing here needs to
 * change when you do, as long as the filenames stay the same.
 */

const MARKS = [
  { src: '/payments/upi.svg', label: 'UPI' },
  { src: '/payments/visa.svg', label: 'Visa' },
  { src: '/payments/mastercard.svg', label: 'Mastercard' },
  { src: '/payments/rupay.svg', label: 'RuPay' },
];

export default function PaymentLogos() {
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {MARKS.map((mark) => (
        <li
          key={mark.label}
          className="flex h-9 w-14 items-center justify-center border border-paper-200 bg-white px-1.5"
        >
          {/* Plain <img>: these are tiny static SVGs, so the optimiser has
              nothing to optimise and would only add a request hop. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mark.src}
            alt={mark.label}
            width={44}
            height={28}
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </li>
      ))}
      {/* Net banking has no single mark to show — a label is the honest option. */}
      <li className="flex h-9 items-center border border-paper-200 px-3 font-quantico text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted">
        Net Banking
      </li>
    </ul>
  );
}
