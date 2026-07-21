import { Quantico, PT_Sans, PT_Sans_Caption } from 'next/font/google';
import localFont from 'next/font/local';

/* =========================================================
   Quantico — PRIMARY (display / headlines)
   Loaded from Google Fonts CDN via next/font/google
   ========================================================= */
export const quantico = Quantico({
  variable: '--font-quantico',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  // system-ui first: the latin subset lacks ₹, so the missing glyph falls
  // through to San Francisco (clean ₹) before any generic that renders it as ₱.
  fallback: ['system-ui', '-apple-system', 'Arial', 'sans-serif'],
});

/* =========================================================
   PT Sans — used for body / description copy
   Loaded from Google Fonts CDN
   ========================================================= */
export const ptSans = PT_Sans({
  variable: '--font-pt-sans',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Arial', 'sans-serif'],
});

/* =========================================================
   PT Sans Caption — body / lede + answer copy (B1 / B2)
   The brand kit calls for "PT Sans Caption Reg" for running copy.
   Loaded from Google Fonts CDN
   ========================================================= */
export const ptSansCaption = PT_Sans_Caption({
  variable: '--font-pt-caption',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Arial', 'sans-serif'],
});

/* =========================================================
   Nebula Sans — body / supporting copy
   Self-hosted from /fonts via next/font/local
   ========================================================= */
export const nebulaSans = localFont({
  variable: '--font-nebula',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Arial', 'sans-serif'],
  src: [
    { path: '../fonts/NebulaSans-Light.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/NebulaSans-LightItalic.ttf', weight: '300', style: 'italic' },
    { path: '../fonts/NebulaSans-Book.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/NebulaSans-BookItalic.ttf', weight: '400', style: 'italic' },
    { path: '../fonts/NebulaSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/NebulaSans-MediumItalic.ttf', weight: '500', style: 'italic' },
    { path: '../fonts/NebulaSans-Semibold.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/NebulaSans-SemiboldItalic.ttf', weight: '600', style: 'italic' },
    { path: '../fonts/NebulaSans-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/NebulaSans-BoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../fonts/NebulaSans-Black.ttf', weight: '900', style: 'normal' },
    { path: '../fonts/NebulaSans-BlackItalic.ttf', weight: '900', style: 'italic' },
  ],
});
