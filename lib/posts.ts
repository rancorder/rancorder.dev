// lib/posts.ts
import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  html: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  tags: string[];
}

function parseFrontMatter(html: string): Record<string, string> {
  const meta: Record<string, string> = {};
  
  // パターン1: YAML形式 (---)
  const yamlMatch = html.match(/^---\n([\s\S]*?)\n---/);
  if (yamlMatch) {
    const frontMatter = yamlMatch[1];
    const lines = frontMatter.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      let key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // ダブルクォートを除去
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // タグの配列をパース
      if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            value = parsed.join(', ');
          }
        } catch (e) {
          console.warn('Failed to parse tags array:', e);
        }
      }
      
      meta[key] = value;
    }
    
    return meta;
  }
  
  // パターン2: HTMLコメント形式 (<!-- -->)
  const commentMatch = html.match(/^<!--\n([\s\S]*?)\n-->/);
  if (commentMatch) {
    const frontMatter = commentMatch[1];
    const lines = frontMatter.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      let key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // ダブルクォートを除去
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // タグの配列をパース
      if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            value = parsed.join(', ');
          }
        } catch (e) {
          console.warn('Failed to parse tags array:', e);
        }
      }
      
      meta[key] = value;
    }
    
    return meta;
  }
  
  return meta;
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    console.warn(`Blog directory not found: ${BLOG_DIR}`);
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  
  const posts = files
    .filter(filename => filename.endsWith('.html'))
    .map(filename => {
      const slug = filename.replace(/\.html$/, '');
      return getPost(slug);
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPost(slug: string): BlogPost | null {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.html`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const meta = parseFrontMatter(html);
    
    const tagsString = meta.tags || '';
    const tags = tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
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

export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  const allPosts = getAllPosts();
  
  const scored = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => {
      let score = 0;
      
      if (post.category === currentPost.category) {
        score += 3;
      }
      
      const sharedTags = post.tags.filter(tag => 
        currentPost.tags.includes(tag)
      );
      score += sharedTags.length * 2;
      
      const daysDiff = Math.abs(
        (new Date(post.date).getTime() - new Date(currentPost.date).getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      if (daysDiff < 30) {
        score += 1;
      }
      
      return { post, score };
    })
    .sort((a, b) => b.score - a.score);
  
  return scored.slice(0, limit).map(item => item.post);
}

export function getAllTags(): { tag: string; count: number; }[] {
  const allPosts = getAllPosts();
  const tagCounts = new Map<string, number>();
  
  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categoriesSet = new Set<string>();
  
  allPosts.forEach(post => {
    if (post.category) {
      categoriesSet.add(post.category);
    }
  });
  
  return Array.from(categoriesSet).sort();
}
