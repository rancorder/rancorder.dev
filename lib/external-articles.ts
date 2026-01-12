import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { ExternalArticle } from '@/types';

const parser = new Parser();

/**
 * Qiita記事取得 + 要約
 * @param username Qiitaユーザー名（例: rancorder）
 */
export async function fetchQiitaArticles(username: string = 'rancorder'): Promise<ExternalArticle[]> {
  try {
    const response = await fetch(`https://qiita.com/api/v2/users/${username}/items?per_page=10`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!response.ok) {
      console.error(`Qiita API error: ${response.status}`);
      return [];
    }

    const articles = await response.json();

    return articles.map((article: any) => ({
      title: article.title,
      url: article.url,
      summary: extractSummary(article.body),
      publishedDate: article.created_at,
      platform: 'Qiita' as const,
    }));
  } catch (error) {
    console.error('Qiita fetch error:', error);
    return [];
  }
}

/**
 * Zenn記事取得 + 要約
 * @param username Zennユーザー名（例: supermassu）
 */
export async function fetchZennArticles(username: string = 'supermassu'): Promise<ExternalArticle[]> {
  try {
    const feed = await parser.parseURL(`https://zenn.dev/${username}/feed`);
    
    return feed.items.slice(0, 10).map(item => ({
      title: item.title || 'Untitled',
      url: item.link || '',
      summary: extractSummary(item.contentSnippet || item.content || ''),
      publishedDate: item.pubDate || new Date().toISOString(),
      platform: 'Zenn' as const,
    }));
  } catch (error) {
    console.error('Zenn fetch error:', error);
    return [];
  }
}

/**
 * note記事取得 + 要約
 * @param username noteユーザー名（※要確認）
 */
export async function fetchNoteArticles(username?: string): Promise<ExternalArticle[]> {
  if (!username) {
    console.warn('note username not provided, skipping...');
    return [];
  }

  try {
    const feed = await parser.parseURL(`https://note.com/${username}/rss`);
    
    return feed.items.slice(0, 10).map(item => ({
      title: item.title || 'Untitled',
      url: item.link || '',
      summary: extractSummary(item.contentSnippet || ''),
      publishedDate: item.pubDate || new Date().toISOString(),
      platform: 'note' as const,
    }));
  } catch (error) {
    console.error('note fetch error:', error);
    return [];
  }
}

/**
 * HTMLから要約抽出（最初の200-300文字）
 * Markdownや不要な記号を削除
 */
function extractSummary(html: string): string {
  const $ = cheerio.load(html);
  const text = $('body').text().trim();
  
  // 最初の300文字 + 改行・記号削除
  return text
    .replace(/\s+/g, ' ')
    .replace(/[#*`]/g, '')
    .slice(0, 300)
    .trim() + '...';
}

/**
 * 全外部記事を統合取得（日付降順ソート）
 * @param noteUsername noteユーザー名（オプション）
 */
export async function fetchAllExternalArticles(noteUsername?: string): Promise<ExternalArticle[]> {
  const [qiita, zenn, note] = await Promise.all([
    fetchQiitaArticles(),
    fetchZennArticles(),
    noteUsername ? fetchNoteArticles(noteUsername) : Promise.resolve([]),
  ]);

  // 日付順にソート（新しい順）
  return [...qiita, ...zenn, ...note]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}
