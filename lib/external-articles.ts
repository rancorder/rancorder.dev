// lib/external-articles.ts
import fs from 'fs';
import path from 'path';

export interface ExternalArticle {
  title: string;
  link: string;
  date: string;
  source: 'Qiita' | 'Zenn';
  excerpt: string;
}

/**
 * キャッシュされた外部記事を取得
 * ビルド時に scripts/fetch-external-articles.js で生成されたJSONを読み込む
 */
export function fetchAllExternalArticles(): ExternalArticle[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'external-articles.json');
    
    // ファイルが存在しない場合は空配列
    if (!fs.existsSync(filePath)) {
      console.warn('External articles cache not found. Run: node scripts/fetch-external-articles.js');
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const articles = JSON.parse(fileContent);
    
    return articles;
  } catch (error) {
    console.error('Failed to read external articles cache:', error);
    return [];
  }
}

/**
 * クライアントサイドで外部記事を取得
 * public/external-articles.json をフェッチ
 */
export async function fetchExternalArticlesClient(): Promise<ExternalArticle[]> {
  try {
    const response = await fetch('/external-articles.json');
    if (!response.ok) return [];
    
    const articles = await response.json();
    return articles;
  } catch (error) {
    console.error('Failed to fetch external articles:', error);
    return [];
  }
}
