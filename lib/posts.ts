import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

// HTMLコメントの Frontmatter を解析
function parseFrontMatter(html: string) {
  const match = html.match(/<!--([\s\S]*?)-->/);
  if (!match) return {};

  const lines = match[1].trim().split('\n');
  const meta: Record<string, string> = {};

  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    let value = rest.join(':').trim();
    
    // 配列形式のタグ ["tag1", "tag2"] を処理
    if (key.trim() === 'tags' && value.startsWith('[') && value.endsWith(']')) {
      // JSON配列をカンマ区切り文字列に変換
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          value = parsed.join(', ');
        }
      } catch (e) {
        // JSON パースに失敗したらそのまま
        console.warn('Failed to parse tags array:', e);
      }
    }
    
    meta[key.trim()] = value;
  }

  return meta;
}

// 読了時間を自動計算
function calculateReadingTime(html: string): string {
  const text = html.replace(/<[^>]+>/g, ''); // HTMLタグ除去
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200); // 1分200語想定
  return `${minutes} min read`;
}

export interface BlogPost {
  slug: string;
  html: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  tags: string[]; // タグを配列で保持
}

// 全記事取得（ビルド時に実行される）
export function getAllPosts(): BlogPost[] {
  try {
    const files = fs.readdirSync(BLOG_DIR);

    const posts = files
      .filter(f => f.toLowerCase().endsWith('.html'))
      .map(file => {
        const slug = file.replace(/\.html$/i, '');
        const html = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
        const meta = parseFrontMatter(html);

        // タグをパース（カンマ区切り）
        const tagsString = meta.tags || '';
        const tags = tagsString
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0);

        // 読了時間（メタデータがあればそれを使用、なければ自動計算）
        const readingTime = meta.readingTime || calculateReadingTime(html);

        return {
          slug,
          html,
          title: meta.title || 'Untitled',
          excerpt: meta.excerpt || '',
          date: meta.date || '',
          category: meta.category || 'Uncategorized',
          readingTime,
          tags,
        };
      });

    // 日付でソート（新しい順）
    posts.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA; // 降順
    });

    return posts;
  } catch (err) {
    console.error('getAllPosts failed:', err);
    return [];
  }
}

// 個別記事取得
export function getPost(slug: string): BlogPost | null {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.html`);
    const html = fs.readFileSync(filePath, 'utf8');
    const meta = parseFrontMatter(html);

    // タグをパース
    const tagsString = meta.tags || '';
    const tags = tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // 読了時間
    const readingTime = meta.readingTime || calculateReadingTime(html);

    return {
      slug,
      html,
      title: meta.title || 'Untitled',
      excerpt: meta.excerpt || '',
      date: meta.date || '',
      category: meta.category || 'Uncategorized',
      readingTime,
      tags,
    };
  } catch (err) {
    console.error(`getPost failed for slug: ${slug}`, err);
    return null;
  }
}

// 全タグを取得（重複なし、使用頻度順）
export function getAllTags(): { tag: string; count: number }[] {
  const allPosts = getAllPosts();
  const tagCount: Record<string, number> = {};

  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count); // 使用頻度順
}

// タグでフィルタ
export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// カテゴリでフィルタ
export function getPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.category.toLowerCase() === category.toLowerCase()
  );
}

// 全カテゴリを取得
export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = allPosts.map(post => post.category);
  return Array.from(new Set(categories)).filter(c => c);
}

// 関連記事を取得（同じカテゴリまたはタグ）
export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  const allPosts = getAllPosts();
  
  // 現在の記事を除外
  const otherPosts = allPosts.filter(p => p.slug !== currentPost.slug);
  
  // スコアリング（カテゴリ一致 +2点、タグ一致 +1点）
  const scored = otherPosts.map(post => {
    let score = 0;
    
    // カテゴリが同じ
    if (post.category === currentPost.category) {
      score += 2;
    }
    
    // タグの一致数
    const matchingTags = post.tags.filter(tag => 
      currentPost.tags.includes(tag)
    ).length;
    score += matchingTags;
    
    return { post, score };
  });
  
  // スコアの高い順にソート
  scored.sort((a, b) => b.score - a.score);
  
  return scored.slice(0, limit).map(s => s.post);
}