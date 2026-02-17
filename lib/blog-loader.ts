// lib/blog.ts
// ブログ記事の読み込み・管理（ディレクトリスキップ対応）
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  html: string;
  readingTime?: string;
  tags?: string[];
}

/**
 * 全てのブログ記事を取得
 * ディレクトリは自動的にスキップされます
 */
export function getAllPosts(): Post[] {
  const contentDir = path.join(process.cwd(), 'content/blog');
  
  if (!fs.existsSync(contentDir)) {
    console.warn('⚠️  Blog content directory not found:', contentDir);
    return [];
  }
  
  const files = fs.readdirSync(contentDir);
  
  const posts = files
    .filter(file => {
      // ===== ディレクトリをスキップ（重要） =====
      const filePath = path.join(contentDir, file);
      
      try {
        const stat = fs.statSync(filePath);
        
        // ディレクトリならスキップ
        if (stat.isDirectory()) {
          console.log(`⏭️  Skipping directory: ${file}`);
          return false;
        }
      } catch (error) {
        console.error(`Error reading file stats for ${file}:`, error);
        return false;
      }
      
      // .html ファイルのみを対象
      return file.endsWith('.html');
    })
    .map(file => {
      try {
        const slug = file.replace('.html', '');
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        // Frontmatter を抽出
        const { data, content } = matter(fileContent);
        
        // HTMLコンテンツを抽出（<body>タグ内）
        const htmlMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const html = htmlMatch ? htmlMatch[1] : content;
        
        return {
          slug,
          title: data.title || '',
          date: data.date || new Date().toISOString(),
          category: data.category || '',
          excerpt: data.excerpt || '',
          content: html,
          html: html,
          readingTime: data.readingTime,
          tags: data.tags || [],
        };
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
        return null;
      }
    })
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  console.log(`✅ Loaded ${posts.length} blog posts`);
  return posts;
}

/**
 * 特定のスラッグのブログ記事を取得
 */
export function getPost(slug: string): Post | null {
  try {
    const filePath = path.join(process.cwd(), 'content/blog', `${slug}.html`);
    
    // ファイルの存在チェック
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Post not found: ${slug}`);
      return null;
    }
    
    // ===== ディレクトリチェック（重要） =====
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      console.warn(`⏭️  Skipping directory: ${slug}`);
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    // HTMLコンテンツを抽出
    const htmlMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const html = htmlMatch ? htmlMatch[1] : content;
    
    return {
      slug,
      title: data.title || '',
      date: data.date || new Date().toISOString(),
      category: data.category || '',
      excerpt: data.excerpt || '',
      content: html,
      html: html,
      readingTime: data.readingTime,
      tags: data.tags || [],
    };
  } catch (error) {
    console.error(`❌ getPost failed for slug: ${slug}`, error);
    return null;
  }
}

/**
 * カテゴリ別に記事を取得
 */
export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.category === category);
}

/**
 * タグ別に記事を取得
 */
export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.tags && post.tags.includes(tag));
}

/**
 * 全カテゴリを取得
 */
export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = new Set(allPosts.map(post => post.category).filter(Boolean));
  return Array.from(categories);
}

/**
 * 全タグを取得
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set(
    allPosts.flatMap(post => post.tags || [])
  );
  return Array.from(tags);
}

/**
 * 最新N件の記事を取得
 */
export function getLatestPosts(limit: number = 5): Post[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}

/**
 * 関連記事を取得（同じカテゴリまたはタグ）
 */
export function getRelatedPosts(currentSlug: string, limit: number = 3): Post[] {
  const currentPost = getPost(currentSlug);
  if (!currentPost) return [];
  
  const allPosts = getAllPosts().filter(post => post.slug !== currentSlug);
  
  // カテゴリとタグでスコアリング
  const scoredPosts = allPosts.map(post => {
    let score = 0;
    
    // 同じカテゴリなら +10
    if (post.category === currentPost.category) {
      score += 10;
    }
    
    // 共通のタグがあれば +5 per tag
    const commonTags = (post.tags || []).filter(tag => 
      (currentPost.tags || []).includes(tag)
    );
    score += commonTags.length * 5;
    
    return { post, score };
  });
  
  // スコア順にソート
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * 記事を検索（タイトル・概要・本文）
 */
export function searchPosts(query: string): Post[] {
  const allPosts = getAllPosts();
  const lowerQuery = query.toLowerCase();
  
  return allPosts.filter(post => {
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      (post.tags || []).some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
}
