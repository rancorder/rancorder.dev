import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'rancorder | Webシステムを作る。思想を実装に変える。',
  description: 'Canvas 2D、リアルタイム流体、物理演算などの技術デモを展示。',
  keywords: ['Web開発', 'Canvas', 'JavaScript', 'TypeScript', 'フロントエンド'],
  openGraph: {
    title: 'rancorder | Webシステムを作る',
    description: 'Canvas 2D、リアルタイム流体、物理演算などの技術デモを展示。',
    url: 'https://rancorder.dev',
    siteName: 'rancorder',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'rancorder | Webシステムを作る',
    description: 'Canvas 2D、リアルタイム流体、物理演算などの技術デモを展示。',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
