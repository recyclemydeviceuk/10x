import type { Metadata } from 'next';
import { Suspense } from 'react';

import ResetPasswordView from '@/components/account/ResetPasswordView';

export const metadata: Metadata = {
  title: 'Set A New Password',
  alternates: { canonical: '/reset-password' },
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main id="main" className="min-h-[70vh] bg-paper">
          <div className="mx-auto max-w-sm px-6 pt-32">
            <div className="h-56 w-full animate-pulse bg-paper-200" />
          </div>
        </main>
      }
    >
      <ResetPasswordView />
    </Suspense>
  );
}
