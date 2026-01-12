// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';
import { fetchAllExternalArticles } from '@/lib/external-articles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rancorder.vercel.app';
  
  console.log('[Sitemap] Starting sitemap generation...');
  
  // 内部ブログ記事
  let posts: any[] = [];
  try {
    posts = getAllPosts();
    console.log(`[Sitemap] Found ${posts.length} internal posts`);
  } catch (error) {
    console.error('[Sitemap] Failed to get posts:', error);
    posts = [];
  }

  // 外部記事（Qiita/Zenn）
  let externalArticles: any[] = [];
  try {
    console.log('[Sitemap] Fetching external articles...');
    externalArticles = await fetchAllExternalArticles();
    console.log(`[Sitemap] Found ${externalArticles.length} external articles`);
  } catch (error) {
    console.error('[Sitemap] Failed to fetch external articles:', error);
    externalArticles = [];
  }

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ja`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 内部記事
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 外部記事
  const externalPages: MetadataRoute.Sitemap = externalArticles.map((article) => ({
    url: article.link,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const allPages = [...staticPages, ...postPages, ...externalPages];
  
  console.log(`[Sitemap] Generated sitemap with ${allPages.length} total pages`);
  
  return allPages;
}
