import { Quantico, PT_Sans } from 'next/font/google';
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
  fallback: ['Arial', 'sans-serif'],
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
  fallback: ['Arial', 'sans-serif'],
});

/* =========================================================
   Nebula Sans — body / supporting copy
   Self-hosted from /fonts via next/font/local
   ========================================================= */
export const nebulaSans = localFont({
  variable: '--font-nebula',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
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
