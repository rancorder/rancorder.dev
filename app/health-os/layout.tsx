import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health OS | rancorder',
  alternates: { canonical: '/health-os' },
  robots: { index: false, follow: false },
};

export default function HealthOSLayout({ children }: { children: React.ReactNode }) {
  return children;
}
