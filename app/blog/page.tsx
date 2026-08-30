import type { Metadata } from 'next';
import KnowledgeVault from '@/components/blog/KnowledgeVault';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Knowledge Vault | rancorder',
  description: 'PoC→Production、Decision Architecture、Automation Reliability、DXの判断知識を探索するKnowledge Vault。',
  alternates: { canonical: '/blog' },
};

function classify(title:string, tags:string[], category?:string) {
  const source = [title, category || '', ...tags].join(' ').toLowerCase();
  if (/dx|業務変革|業務改善|デジタル|導入|定着|業務フロー/.test(source)) return 'dx';
  if (/自動化|automation|監視|運用|reliab|障害|復旧|scrap|crawler|テスト/.test(source)) return 'reliability';
  if (/poc|本番|production|ai|llm|whisper|bert|api|aws/.test(source)) return 'production';
  return 'decision';
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts().map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    readingTime: post.readingTime,
    tags: post.tags,
    category: classify(post.title, post.tags, post.category),
  }));

  return <KnowledgeVault posts={posts} />;
}
