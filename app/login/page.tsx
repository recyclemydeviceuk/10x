import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import AuthLayout from '../../components/AuthLayout';
import LoginForm from '../../components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description:
    'Sign in to 10X — The Brain Battery. We’ll email you a 6-digit verification code. No password needed.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthLayout
      heading="Sign in to 10X"
      footer={
        <>
          Don&rsquo;t have an account?{' '}
          <Link
            href="/register"
            className="cursor-pointer font-bold text-brand-blue transition-colors hover:text-brand-blue-dark"
          >
            Sign up
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
