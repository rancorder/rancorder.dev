// app/blog/page.tsx (統合版)
import { getAllPosts, getAllTags, getAllCategories } from '@/lib/posts';
import { fetchAllExternalArticles } from '@/lib/external-articles';
import BlogPageClient from './BlogPageClient';

export const metadata = {
  title: 'Blog | Tech Articles & Insights',
  description: 'エンタープライズPM、意思決定設計、本番運用システムに関する技術記事',
};

export const revalidate = 3600; // 1時間ごとにISRで再生成

type ExternalArticleLike = {
  source?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  link?: string;
  url?: string;
  slug?: string;
};

export default function BlogPage() {
  // 内部記事（HTMLファイル）
  const posts = getAllPosts();
  const allTags = getAllTags();
  const allCategories = getAllCategories();

  // 外部記事（キャッシュから読み込み）
  const externalArticles = (fetchAllExternalArticles() || []) as ExternalArticleLike[];

  return (
    <BlogPageClient
      initialPosts={posts}
      allTags={allTags}
      allCategories={allCategories}
      externalArticles={externalArticles}
    />
  );
}
