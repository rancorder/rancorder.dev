// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';
import fs from 'fs';
import path from 'path';

interface ExternalArticle {
  title: string;
  url: string;
  source: 'Qiita' | 'Zenn';
  date: string;
  excerpt: string;
}

interface BlogPost {
  slug: string;
  date: string;
}

/**
 * content/blog ディレクトリから直接HTMLファイルを読み込む
 */
function getBlogPostsFromHtml(): BlogPost[] {
  try {
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    
    if (!fs.existsSync(blogDir)) {
      console.warn('[Sitemap] content/blog directory not found');
      return [];
    }

    const files = fs.readdirSync(blogDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    console.log(`[Sitemap] Found ${htmlFiles.length} HTML files in content/blog`);

    const posts: BlogPost[] = htmlFiles.map(filename => {
      const filePath = path.join(blogDir, filename);
      const stats = fs.statSync(filePath);
      
      // ファイル名から slug を抽出（拡張子を除く）
      const slug = filename.replace('.html', '');
      
      // ファイルの更新日時を使用
      const date = stats.mtime.toISOString();

      console.log(`[Sitemap] Processing: ${slug} (${date})`);

      return {
        slug,
        date,
      };
    });

    return posts;
  } catch (error) {
    console.error('[Sitemap] Failed to load HTML blog posts:', error);
    return [];
  }
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
  
  // 内部ブログ記事（HTMLファイルから直接読み込み）
  let posts: BlogPost[] = [];
  try {
    // まずMDX形式を試す
    const mdxPosts = getAllPosts();
    if (mdxPosts.length > 0) {
      console.log(`[Sitemap] Found ${mdxPosts.length} MDX posts`);
      posts = mdxPosts;
    } else {
      // MDXが無ければHTMLファイルを読み込む
      console.log('[Sitemap] No MDX posts found, trying HTML files');
      posts = getBlogPostsFromHtml();
    }
  } catch (error) {
    console.error('[Sitemap] Failed to get MDX posts, trying HTML:', error);
    posts = getBlogPostsFromHtml();
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
    {
      url: `${baseUrl}/portfolio/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/ja`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
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
  const externalPages: MetadataRoute.Sitemap = externalArticles
    .map((article) => {
      const articleUrl = article.url || (article as any).link;
      
      if (!articleUrl) {
        console.warn(`[Sitemap] Missing URL for article: ${article.title}`);
        return null;
      }
      
      return {
        url: articleUrl,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    })
    .filter((page): page is NonNullable<typeof page> => page !== null);

  const allPages = [...staticPages, ...postPages, ...externalPages];
  
  console.log(`[Sitemap] Generated sitemap with ${allPages.length} total pages`);
  console.log(`[Sitemap] Breakdown: ${staticPages.length} static + ${postPages.length} posts + ${externalPages.length} external`);
  
  return allPages;
}
