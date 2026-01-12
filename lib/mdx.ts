import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { BlogPost } from '@/types';

const contentDirectory = path.join(process.cwd(), 'content/blog');

/**
 * 全MDX記事を自動取得（日付降順）
 */
export function getAllPosts(): BlogPost[] {
  // content/blogディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(contentDirectory)) {
    console.warn('content/blog directory does not exist');
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || content.slice(0, 200).replace(/[#*`]/g, '') + '...',
        category: data.category || 'Uncategorized',
        readingTime: readingTime(content).text,
        content,
      };
    })
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return posts;
}

/**
 * 個別記事取得（slug指定）
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      category: data.category,
      readingTime: readingTime(content).text,
      content,
    };
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
