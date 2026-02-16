// app/sitemap.ts
// LPページを自動検出してサイトマップに含める
import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Post {
  slug: string;
  date: string;
  title: string;
}

interface LPPage {
  path: string;
  lastModified: Date;
}

// ブログ記事を取得
function getAllPosts(): Post[] {
  const contentDir = path.join(process.cwd(), 'content/blog');
  
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  
  const files = fs.readdirSync(contentDir);
  
  const posts = files
    .filter(file => file.endsWith('.html'))
    .map(file => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      
      return {
        slug: file.replace('.html', ''),
        date: data.date || new Date().toISOString(),
        title: data.title || '',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return posts;
}

// ===== LPページを自動検出 =====
function getAllLPPages(): LPPage[] {
  const lpDir = path.join(process.cwd(), 'app/lp');
  
  if (!fs.existsSync(lpDir)) {
    return [];
  }
  
  const lpPages: LPPage[] = [];
  
  try {
    // /app/lp/* のディレクトリを取得
    const dirs = fs.readdirSync(lpDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    dirs.forEach(dir => {
      const pagePath = path.join(lpDir, dir, 'page.tsx');
      
      // page.tsx が存在するかチェック
      if (fs.existsSync(pagePath)) {
        const stats = fs.statSync(pagePath);
        
        lpPages.push({
          path: `/lp/${dir}`,
          lastModified: stats.mtime,
        });
        
        console.log(`✅ Detected LP: /lp/${dir}`);
      }
    });
  } catch (error) {
    console.error('Error scanning LP directory:', error);
  }
  
  return lpPages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rancorder.vercel.app';
  
  // ブログ記事を取得
  const posts = getAllPosts();
  const blogUrls = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  
  // ===== LPページを自動検出 =====
  const lpPages = getAllLPPages();
  const lpUrls = lpPages.map(page => ({
    url: `${baseUrl}${page.path}`,
    lastModified: page.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  console.log(`📊 Sitemap generated:`);
  console.log(`  - Blog posts: ${posts.length}`);
  console.log(`  - LP pages: ${lpPages.length}`);
  
  return [
    // トップページ
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    
    // ブログ一覧
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    
    // ブログ記事（自動）
    ...blogUrls,
    
    // ===== LPページ（自動で追加） =====
    ...lpUrls,
  ];
}
