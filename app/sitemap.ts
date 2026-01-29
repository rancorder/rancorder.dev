// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';
import fs from 'fs';
import path from 'path';

interface ExternalArticle {
  title: string;
  url: string;  // ← link から url に変更
  source: 'Qiita' | 'Zenn';
  date: string;
  excerpt: string;
}

/**
 * 外部記事をJSONファイルから直接読み込み
 * sitemap生成時に確実に読み込むため、lib/external-articlesに依存しない
 */
function loadExternalArticles(): ExternalArticle[] {
  try {
    // 複数のパスを試行
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'external-articles.json'),
      path.join(process.cwd(), '..', 'public', 'external-articles.json'),
      './public/external-articles.json',
    ];

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          console.log(`[Sitemap] Found external-articles.json at: ${filePath}`);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const articles = JSON.parse(fileContent);
          
          if (Array.isArray(articles)) {
            console.log(`[Sitemap] Loaded ${articles.length} external articles`);
            return articles;
          }
        }
      } catch (err) {
        // 次のパスを試行
        continue;
      }
    }

    console.warn('[Sitemap] external-articles.json not found in any location');
    return [];
  } catch (error) {
    console.error('[Sitemap] Failed to load external articles:', error);
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rancorder.vercel.app';
  
  // 内部ブログ記事
  let posts: any[] = [];
  try {
    posts = getAllPosts();
    console.log(`[Sitemap] Found ${posts.length} internal posts`);
  } catch (error) {
    console.error('[Sitemap] Failed to get posts:', error);
    posts = [];
  }

  // 外部記事（直接読み込み）
  const externalArticles = loadExternalArticles();

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
    url: article.url,  // ← link から url に変更
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const allPages = [...staticPages, ...postPages, ...externalPages];
  
  console.log(`[Sitemap] Generated sitemap with ${allPages.length} total pages`);
  console.log(`[Sitemap] Breakdown: ${staticPages.length} static + ${postPages.length} posts + ${externalPages.length} external`);
  
  return allPages;
}
