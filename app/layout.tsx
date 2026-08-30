import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import MissionXP from '../components/MissionXP';
import WelcomeBack from '../components/WelcomeBack';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://rancorder.dev'),
  title: 'rancorder | PoCを、止まらない運用へ。',
  description: '製造業B2B × Technical PM × AI実装支援。曖昧なPoCを、判断・責任・監視・復旧まで設計された本番運用へ移行します。',
  keywords: ['Technical PM', 'AI導入', 'PoC', '本番移行', '製造業DX', '自動化', '運用設計'],
  openGraph: {
    title: 'rancorder | PoCを、止まらない運用へ。',
    description: '曖昧なPoCを、判断・責任・監視・復旧まで設計された本番運用へ。',
    url: 'https://rancorder.dev',
    siteName: 'rancorder',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'rancorder | PoCを、止まらない運用へ。',
    description: '製造業B2B × Technical PM × AI実装支援。動くデモを、使い続けられるシステムへ。',
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} ${inter.variable}`}>
        {children}
        <WelcomeBack />
        <MissionXP />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
