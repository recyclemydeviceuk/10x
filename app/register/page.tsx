import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import AuthLayout from '../../components/AuthLayout';
import RegisterForm from '../../components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create account',
  description:
    'Create your 10X account — name, email, phone. Verify with a 6-digit email OTP. No password needed.',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthLayout
      heading="Create your account"
      footer={
        <>
          Already have an account?{' '}
          <Link
            href="/login"
            className="cursor-pointer font-bold text-brand-blue transition-colors hover:text-brand-blue-dark"
          >
            Log in
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
