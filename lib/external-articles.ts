// lib/external-articles.ts
import fs from 'fs';
import path from 'path';

/**
 * 外部記事の型定義
 */
export interface ExternalArticle {
  title: string;
  link: string;
  source: 'Qiita' | 'Zenn';
  date: string;
  excerpt: string;
}

/**
 * キャッシュされた外部記事を全件取得
 * 
 * @returns 外部記事の配列（エラー時は空配列）
 */
export function fetchAllExternalArticles(): ExternalArticle[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'external-articles.json');
    
    // ファイル存在チェック
    if (!fs.existsSync(filePath)) {
      console.warn('⚠️ external-articles.json not found. Run prebuild script first.');
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const articles = JSON.parse(fileContent);
    
    // データ検証
    if (!Array.isArray(articles)) {
      console.error('❌ Invalid external-articles.json format (not an array)');
      return [];
    }
    
    console.log(`✅ Loaded ${articles.length} external articles`);
    return articles;
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Failed to load external articles:', error.message);
    }
    return [];
  }
}

/**
 * 最新のN件を取得
 */
export function getLatestExternalArticles(count: number = 6): ExternalArticle[] {
  const allArticles = fetchAllExternalArticles();
  return allArticles.slice(0, count);
}

/**
 * プラットフォーム別にフィルタ
 */
export function filterBySource(source: 'Qiita' | 'Zenn'): ExternalArticle[] {
  const allArticles = fetchAllExternalArticles();
  return allArticles.filter(article => article.source === source);
}
