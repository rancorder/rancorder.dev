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
  const lines = html.split('\n');
  const meta: Record<string, string> = {};
  let inFrontMatter = false;

  for (const line of lines) {
    if (line.trim() === '---') {
      if (!inFrontMatter) {
        inFrontMatter = true;
        continue;
      } else {
        break;
      }
    }
    if (inFrontMatter) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        let [, key, value] = match;
        value = value.trim();
        
        if (key.trim() === 'tags' && value.startsWith('[') && value.endsWith(']')) {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              value = parsed.join(', ');
            }
          } catch (e) {
            console.warn('Failed to parse tags array:', e);
          }
        }
        
        meta[key.trim()] = value;
      }
    }
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

// 修正: タグをカウント付きで返す
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

// 修正: カテゴリをカウント付きで返す
export function getAllCategories(): { category: string; count: number; }[] {
  const allPosts = getAllPosts();
  const categoryCounts = new Map<string, number>();
  
  allPosts.forEach(post => {
    if (post.category) {
      categoryCounts.set(post.category, (categoryCounts.get(post.category) || 0) + 1);
    }
  });
  
  return Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}