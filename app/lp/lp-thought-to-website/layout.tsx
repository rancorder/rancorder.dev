import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '思考をWebサイトに変える | rancorder',
  description: '要件整理から公開までを支援するWebサイト生成システム。',
  alternates: { canonical: '/lp/lp-thought-to-website' },
};

export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
