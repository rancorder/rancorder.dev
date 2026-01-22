// lib/blog-loader.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  readingTime: string;
  content?: string;
  fileType: 'html' | 'mdx' | 'md';
}

const contentDirectory = path.join(process.cwd(), 'content/blog');

/**
 * HTMLファイルからメタデータを抽出
 */
function extractHtmlMetadata(content: string): {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  readingTime: string;
} | null {
  // HTMLコメント内のメタデータを抽出
  const metaRegex = /<!--\s*([\s\S]*?)\s*-->/;
  const match = content.match(metaRegex);
  
  if (!match) {
    return null;
  }

  const metaText = match[1];
  const lines = metaText.split('\n');
  const metadata: Record<string, string> = {};

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      metadata[key] = value;
    }
  }

  // テキストから読み取り時間を計算
  const textContent = content.replace(/<[^>]+>/g, ''); // HTMLタグを除去
  const readTime = readingTime(textContent);

  return {
    title: metadata.title || 'Untitled',
    date: metadata.date || new Date().toISOString(),
    excerpt: metadata.excerpt || '',
    category: metadata.category || 'Uncategorized',
    readingTime: metadata.readingTime || readTime.text,
  };
}

/**
 * MDXファイルからメタデータを抽出
 */
function extractMdxMetadata(content: string): {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  readingTime: string;
} {
  const { data, content: mdxContent } = matter(content);
  const readTime = readingTime(mdxContent);

  // クリーンな抜粋を生成
  let cleaned = mdxContent.replace(/^import\s+.+from\s+['"].+['"]\s*$/gm, '');
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  cleaned = cleaned.replace(/[#*`_\[\]]/g, '');
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');
  cleaned = cleaned.trim();
  
  const excerpt = data.description || data.excerpt || 
    (cleaned.length > 200 ? cleaned.slice(0, 200) + '...' : cleaned);

  return {
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    excerpt,
    category: data.category || 'Uncategorized',
    readingTime: data.readingTime || readTime.text,
  };
}

/**
 * 全記事を取得（HTML、MDX、MD対応）
 */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) {
    console.warn('content/blog directory does not exist');
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);
  
  const posts: BlogPost[] = [];

  for (const fileName of fileNames) {
    // 対応する拡張子のみ処理
    if (!fileName.match(/\.(html|mdx|md)$/)) {
      continue;
    }

    const slug = fileName.replace(/\.(html|mdx|md)$/, '');
    const fullPath = path.join(contentDirectory, fileName);
    
    try {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      let metadata: ReturnType<typeof extractHtmlMetadata>;
      let fileType: 'html' | 'mdx' | 'md';

      if (fileName.endsWith('.html')) {
        metadata = extractHtmlMetadata(fileContents);
        fileType = 'html';
      } else {
        metadata = extractMdxMetadata(fileContents);
        fileType = fileName.endsWith('.mdx') ? 'mdx' : 'md';
      }

      if (metadata) {
        posts.push({
          slug,
          title: metadata.title,
          date: metadata.date,
          excerpt: metadata.excerpt,
          category: metadata.category,
          readingTime: metadata.readingTime,
          fileType,
        });
      }
    } catch (error) {
      console.error(`Failed to load post: ${fileName}`, error);
    }
  }

  // 日付降順でソート
  posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return posts;
}

/**
 * 個別記事取得（slug指定）
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    // HTML, MDX, MDの順で探す
    const extensions = ['html', 'mdx', 'md'];
    
    for (const ext of extensions) {
      const fullPath = path.join(contentDirectory, `${slug}.${ext}`);
      
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        let metadata: ReturnType<typeof extractHtmlMetadata>;
        let fileType: 'html' | 'mdx' | 'md';

        if (ext === 'html') {
          metadata = extractHtmlMetadata(fileContents);
          fileType = 'html';
        } else {
          metadata = extractMdxMetadata(fileContents);
          fileType = ext === 'mdx' ? 'mdx' : 'md';
        }

        if (metadata) {
          return {
            slug,
            title: metadata.title,
            date: metadata.date,
            excerpt: metadata.excerpt,
            category: metadata.category,
            readingTime: metadata.readingTime,
            content: fileContents,
            fileType,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Failed to load post: ${slug}`, error);
    return null;
  }
}

/**
 * カテゴリ別記事取得
 */
export function getPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.category === category);
}

/**
 * 全カテゴリ取得（重複なし）
 */
export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = allPosts.map(post => post.category);
  return Array.from(new Set(categories));
}
