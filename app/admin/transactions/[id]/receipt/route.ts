import { notFound } from 'next/navigation';

import { getCustomer, getOrder, getTransaction } from '@/lib/admin/data';
import { dateTime, fullDate, methodLabel, money } from '@/lib/admin/format';
import { createPdf } from '@/lib/admin/pdf';
import { requireSession } from '@/lib/admin/session';

/**
 * Transaction receipt as a PDF.
 *
 * Sits under /admin so the middleware gate covers it, and re-checks the session
 * anyway — a receipt carries a customer's name, address and payment reference,
 * so it must never be fetchable by URL alone.
 */
/** Baseline for the footer block, in points from the top of the page. */
const PAGE_FOOTER_Y = 760;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireSession();

  const { id } = await params;
  const txn = getTransaction(id);
  if (!txn) notFound();

  const order = getOrder(txn.orderId);
  const customer = getCustomer(txn.customerId);
  const doc = createPdf();

  const LEFT = 56;
  const RIGHT = 539;
  let y = 72;

  /* ------------------------------------------------------------- header */
  doc.text('10X', LEFT, y, { size: 22, bold: true });
  doc.text('THE BRAIN BATTERY', LEFT, y + 16, { size: 7.5, grey: true });
  doc.text('PAYMENT RECEIPT', RIGHT, y, { size: 11, bold: true, align: 'right' });
  doc.text(txn.gatewayReference, RIGHT, y + 16, { size: 8, grey: true, align: 'right' });

  y += 36;
  doc.rule(LEFT, y, RIGHT);

  /* ---------------------------------------------------------- meta rows */
  y += 30;
  const metaLeft: [string, string][] = [
    ['Receipt for', customer?.name ?? '—'],
    ['Email', customer?.email ?? '—'],
    ['Phone', customer?.phone ?? '—'],
  ];
  const metaRight: [string, string][] = [
    ['Order', txn.orderReference],
    ['Paid on', dateTime(txn.at)],
    ['Method', `${methodLabel(txn.method)} - Razorpay`],
  ];

  metaLeft.forEach(([label, value], i) => {
    doc.text(label.toUpperCase(), LEFT, y + i * 26, { size: 7, grey: true });
    doc.text(value, LEFT, y + i * 26 + 12, { size: 10 });
  });
  metaRight.forEach(([label, value], i) => {
    doc.text(label.toUpperCase(), RIGHT, y + i * 26, { size: 7, grey: true, align: 'right' });
    doc.text(value, RIGHT, y + i * 26 + 12, { size: 10, align: 'right' });
  });

  /* ----------------------------------------------------- billing address */
  y += 26 * 3 + 14;
  if (customer) {
    doc.text('BILLING ADDRESS', LEFT, y, { size: 7, grey: true });
    const lines = [
      customer.address.line1,
      customer.address.line2,
      `${customer.address.city}, ${customer.address.state} ${customer.address.pincode}`,
    ].filter(Boolean) as string[];
    lines.forEach((line, i) => doc.text(line, LEFT, y + 14 + i * 13, { size: 10 }));
    y += 14 + lines.length * 13;
  }

  /* ---------------------------------------------------------- line items */
  y += 26;
  doc.rule(LEFT, y, RIGHT, { light: true });
  y += 16;
  doc.text('ITEM', LEFT, y, { size: 7, grey: true });
  doc.text('QTY', RIGHT - 150, y, { size: 7, grey: true, align: 'right' });
  doc.text('AMOUNT', RIGHT, y, { size: 7, grey: true, align: 'right' });
  y += 8;
  doc.rule(LEFT, y, RIGHT, { light: true });

  y += 20;
  for (const item of order?.items ?? []) {
    doc.text(item.name, LEFT, y, { size: 10 });
    doc.text(item.packets, LEFT, y + 13, { size: 8, grey: true });
    doc.text(String(item.quantity), RIGHT - 150, y, { size: 10, align: 'right' });
    doc.text(money(item.unitPrice * item.quantity), RIGHT, y, { size: 10, align: 'right' });
    y += 32;
  }

  doc.rule(LEFT, y, RIGHT, { light: true });

  /* -------------------------------------------------------------- totals */
  y += 20;
  const totals: [string, string][] = [
    ['Subtotal', money(order?.subtotal ?? txn.amount)],
    ['Shipping', order?.shipping ? money(order.shipping) : 'Free'],
  ];
  for (const [label, value] of totals) {
    doc.text(label, RIGHT - 150, y, { size: 9.5, grey: true, align: 'right' });
    doc.text(value, RIGHT, y, { size: 9.5, align: 'right' });
    y += 17;
  }

  y += 6;
  doc.rule(RIGHT - 210, y, RIGHT);
  y += 20;
  doc.text('TOTAL PAID', RIGHT - 150, y, { size: 9, bold: true, align: 'right' });
  doc.text(money(txn.amount), RIGHT, y, { size: 14, bold: true, align: 'right' });
  y += 15;
  doc.text('Inclusive of all taxes', RIGHT, y, { size: 8, grey: true, align: 'right' });

  if (txn.status === 'refunded' && txn.refundedAmount) {
    y += 22;
    doc.text(`Refunded ${money(txn.refundedAmount)}`, RIGHT, y, { size: 9.5, align: 'right' });
  }

  /* -------------------------------------------------------------- footer */
  const footer = PAGE_FOOTER_Y;
  doc.rule(LEFT, footer - 18, RIGHT, { light: true });
  doc.text('10X Formulas', LEFT, footer, { size: 8, grey: true });
  doc.text('support@10xdrink.com - 10xdrink.com', LEFT, footer + 12, { size: 8, grey: true });
  doc.text(
    `Nutraceutical, not for medicinal use. Generated ${fullDate(new Date().toISOString())}.`,
    RIGHT,
    footer + 12,
    { size: 7.5, grey: true, align: 'right' },
  );

  const bytes = doc.build();
  const filename = `10X-receipt-${txn.orderReference}.pdf`;

  return new Response(bytes as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      // A receipt is per-customer data — never let a shared cache hold it.
      'Cache-Control': 'private, no-store',
    },
  });
}
