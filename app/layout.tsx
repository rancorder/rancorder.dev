// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Enterprise PM Portfolio | 意思決定設計で止まらないプロジェクトを',
  description: 'エンタープライズB2Bで、PoCで止まるプロジェクトを「意思決定の設計」から本番・運用まで前に進める技術PM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning data-theme="dark">
      <head>
        {/* テーマ固定（ちらつき防止） */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.setAttribute('data-theme', 'dark');
            `,
          }}
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
