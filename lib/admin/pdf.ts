/**
 * A very small PDF writer — enough for a one-page receipt, and nothing more.
 *
 * Written by hand rather than pulled from npm: a receipt is a handful of text
 * runs and rules, and the alternative is a multi-megabyte dependency in the
 * server bundle for a document this simple.
 *
 * Uses the base-14 Helvetica faces, which every reader has built in, so no font
 * embedding is needed. That does mean WinAnsi only — see `latin1` below for how
 * the rupee sign is handled.
 */

type Op = string;

export type PdfDoc = {
  text: (
    value: string,
    x: number,
    y: number,
    options?: { size?: number; bold?: boolean; grey?: boolean; align?: 'left' | 'right' },
  ) => void;
  rule: (x1: number, y: number, x2: number, options?: { light?: boolean }) => void;
  build: () => Uint8Array;
};

/** A4 in points. */
export const PAGE = { width: 595.28, height: 841.89 };

/**
 * Helvetica's WinAnsi encoding has no ₹ (U+20B9). Rather than ship a broken
 * glyph, prices are written as "INR 1,199" — unambiguous, and it survives every
 * reader. Anything else outside latin-1 is dropped rather than mojibake'd.
 */
function latin1(value: string): string {
  return value
    .replace(/₹\s?/g, 'INR ')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/·/g, '-')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
}

function escapeText(value: string): string {
  return latin1(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/** Helvetica advance widths, /1000 em — enough for right-aligning a column. */
const WIDTHS: Record<string, number> = {};
const WIDTH_DEFAULT = 556;
for (const [chars, width] of [
  [' !I|.,:;\'`i-lj', 250],
  ['fjrt()[]{}/\\', 333],
  ['*"', 400],
  ['0123456789$', 556],
  ['abcdeghknopqsuvxyz', 556],
  ['ABCDEFGHKLPRSTVXYZ&', 667],
  ['MOQCDGNUW%', 778],
  ['m', 833],
  ['w', 722],
] as const) {
  for (const ch of chars) WIDTHS[ch] = width;
}

function textWidth(value: string, size: number): number {
  let total = 0;
  for (const ch of latin1(value)) total += WIDTHS[ch] ?? WIDTH_DEFAULT;
  return (total / 1000) * size;
}

export function createPdf(): PdfDoc {
  const ops: Op[] = [];

  function text(
    value: string,
    x: number,
    y: number,
    { size = 10, bold = false, grey = false, align = 'left' } = {},
  ) {
    const font = bold ? '/F2' : '/F1';
    // PDF's origin is bottom-left; callers think top-down.
    const py = PAGE.height - y;
    const px = align === 'right' ? x - textWidth(value, size) : x;
    const fill = grey ? '0.42 0.45 0.49 rg' : '0.02 0.02 0.03 rg';
    ops.push(`BT ${fill} ${font} ${size} Tf 1 0 0 1 ${px.toFixed(2)} ${py.toFixed(2)} Tm (${escapeText(value)}) Tj ET`);
  }

  function rule(x1: number, y: number, x2: number, { light = false } = {}) {
    const py = PAGE.height - y;
    const stroke = light ? '0.90 0.91 0.92 RG' : '0.02 0.02 0.03 RG';
    ops.push(`${stroke} 0.7 w ${x1.toFixed(2)} ${py.toFixed(2)} m ${x2.toFixed(2)} ${py.toFixed(2)} l S`);
  }

  function build(): Uint8Array {
    const content = ops.join('\n');
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    ];

    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [];
    objects.forEach((body, i) => {
      offsets.push(pdf.length);
      pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
    });

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const offset of offsets) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    // latin1 out — the byte offsets in the xref table must match the bytes written.
    return Uint8Array.from(pdf, (c) => c.charCodeAt(0) & 0xff);
  }

  return { text, rule, build };
}
