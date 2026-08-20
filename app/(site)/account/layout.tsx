import AccountShell from '@/components/account/AccountShell';

export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AccountShell>{children}</AccountShell>;
}
