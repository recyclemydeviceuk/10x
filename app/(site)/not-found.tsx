import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 800, margin: 0 }}>404</h1>
      <p style={{ marginTop: '0.5rem', color: '#666' }}>
        The page you are looking for could not be found.
      </p>
      <Link href="/" style={{ marginTop: '1.5rem', textDecoration: 'underline' }}>
        Return home
      </Link>
    </main>
  );
}
