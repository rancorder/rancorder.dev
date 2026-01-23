// app/layout.tsx (Analytics追加版)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Enterprise PM Portfolio | 意思決定設計で止まらないプロジェクトを',
  description: 'エンタープライズB2Bで、PoCで止まるプロジェクトを「意思決定の設計」から本番・運用まで前に進める技術PM',
  keywords: ['Enterprise PM', 'Technical PM', '意思決定設計', 'Production Engineering'],
  authors: [{ name: 'H.M' }],
  openGraph: {
    title: 'Enterprise PM Portfolio',
    description: 'エンタープライズB2Bで、PoCで止まるプロジェクトを意思決定の設計から前に進める',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Technical Blog RSS Feed"
          href="/rss.xml"
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
