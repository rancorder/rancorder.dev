// app/layout.tsx - モバイル完全対応版
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'H・M | Enterprise Technical Project Manager - PoC to Production Specialist',
  description:
    'Enterprise Technical PM with 17 years manufacturing experience. Specializing in moving stagnant PoCs to stable production through decision design, automation, and operational resilience.',
  keywords: [
    'Technical Project Manager',
    'Enterprise PM',
    'PoC to Production',
    'Automation',
    'SRE',
    'Production Operations',
    'Decision Design',
    'Manufacturing PM',
    'Full Stack Engineer',
    'B2B Systems',
  ],
  authors: [{ name: 'H・M' }],
  openGraph: {
    title: 'H・M | Enterprise Technical Project Manager',
    description:
      'Turning enterprise automation PoCs into robust production systems. 17 years manufacturing PM × Full-stack implementation.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'H・M | Enterprise Technical Project Manager',
    description:
      'I help enterprise B2B teams move from PoC to stable production through decision design and operational resilience.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* モバイル完全対応のビューポート設定 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, user-scalable=yes, viewport-fit=cover"
        />
        <link rel="canonical" href="https://portfolio-react-enterprise.vercel.app" />
      </head>
      <body>{children}</body>
    </html>
  );
}
