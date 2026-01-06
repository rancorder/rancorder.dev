// app/layout.tsx - EY想定版（SEO最適化）
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'H・M | Enterprise Technical Project Manager - PoC to Production Specialist',
  description:
    'Enterprise Technical PM with 17 years manufacturing experience. Specializing in moving stagnant PoCs to stable production through decision design, automation, and operational resilience. Proven track record: 99.8% uptime, 54-site automation platform, 11+ months continuous operation.',
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
        <link rel="canonical" href="https://your-domain.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
