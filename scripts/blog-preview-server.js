#!/usr/bin/env node

/**
 * ブログプレビューサーバー
 * 作った記事をブラウザで確認できる
 * 
 * 使い方:
 *   node blog-preview-server.js
 *   node blog-preview-server.js content/blog/
 *   node blog-preview-server.js --port 8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// ===================================
// 設定
// ===================================

const DEFAULT_PORT = 3030;
const DEFAULT_DIR = 'content/blog';

// ===================================
// Frontmatter パーサー（frontmatter-qa.jsと同じ）
// ===================================

function parseFrontmatter(content) {
  if (!content || content.trim().length === 0) {
    return { meta: {}, body: '', error: null };
  }
  
  // YAML形式（---）
  if (content.trim().startsWith('---')) {
    try {
      const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!match) {
        return { meta: {}, body: content, error: 'YAML format not matched' };
      }
      
      const frontmatterText = match[1];
      const body = match[2];
      const meta = parseSimpleYAML(frontmatterText);
      
      return { meta, body, error: null };
    } catch (error) {
      return { meta: {}, body: content, error: error.message };
    }
  }
  
  // HTMLコメント形式（<!--）
  const htmlCommentMatch = content.match(/^<!--\s*\n([\s\S]*?)\n-->\s*\n([\s\S]*)$/);
  if (htmlCommentMatch) {
    try {
      const frontmatterText = htmlCommentMatch[1];
      const body = htmlCommentMatch[2];
      const meta = parseSimpleYAML(frontmatterText);
      
      return { meta, body, error: null };
    } catch (error) {
      return { meta: {}, body: content, error: error.message };
    }
  }
  
  return { meta: {}, body: content, error: null };
}

function parseSimpleYAML(text) {
  const meta = {};
  const lines = text.split('\n');
  
  let currentKey = null;
  let currentValue = '';
  let inMultiline = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim().length === 0) {
      if (inMultiline) currentValue += '\n';
      continue;
    }
    
    if (line.trim().startsWith('#')) continue;
    
    const colonIndex = line.indexOf(':');
    
    if (colonIndex > 0 && !inMultiline) {
      if (currentKey) {
        meta[currentKey] = parseValue(currentValue.trim());
      }
      
      currentKey = line.substring(0, colonIndex).trim();
      currentValue = line.substring(colonIndex + 1).trim();
      
      if (currentValue.endsWith('|') || currentValue.endsWith('>')) {
        inMultiline = true;
        currentValue = '';
      } else if (currentValue.startsWith('[') && !currentValue.endsWith(']')) {
        inMultiline = true;
      }
    } else if (inMultiline && currentKey) {
      currentValue += '\n' + line;
      if (line.trim().endsWith(']')) {
        inMultiline = false;
      }
    }
  }
  
  if (currentKey) {
    meta[currentKey] = parseValue(currentValue.trim());
  }
  
  return meta;
}

function parseValue(value) {
  if (value.length === 0) return '';
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  
  if (value.startsWith('[') && value.endsWith(']')) {
    try {
      return JSON.parse(value.replace(/\s+/g, ' '));
    } catch {
      return value;
    }
  }
  
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  if (value.toLowerCase() === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return parseFloat(value);
  
  return value;
}

// ===================================
// ファイル一覧取得
// ===================================

function getArticleList(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  const files = fs.readdirSync(dir);
  
  return files
    .filter(f => f.endsWith('.html') || f.endsWith('.md') || f.endsWith('.mdx'))
    .map(filename => {
      const filepath = path.join(dir, filename);
      const content = fs.readFileSync(filepath, 'utf-8');
      const parsed = parseFrontmatter(content);
      
      return {
        filename,
        filepath,
        title: parsed.meta.title || filename,
        date: parsed.meta.date || '',
        category: parsed.meta.category || '',
        error: parsed.error,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ===================================
// HTML生成
// ===================================

function generateIndexHTML(articles, dir) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ブログプレビュー - 記事一覧</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #7c3aed, #22c55e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .subtitle {
      color: #888;
      margin-bottom: 2rem;
    }
    .stats {
      background: rgba(124, 58, 237, 0.1);
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 2rem;
      display: flex;
      gap: 2rem;
    }
    .stat {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      font-size: 0.875rem;
      color: #888;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #7c3aed;
    }
    .article-list {
      display: grid;
      gap: 1rem;
    }
    .article-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.2s;
      text-decoration: none;
      color: inherit;
      display: block;
    }
    .article-card:hover {
      background: rgba(124, 58, 237, 0.1);
      border-color: rgba(124, 58, 237, 0.5);
      transform: translateY(-2px);
    }
    .article-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.5rem;
    }
    .article-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #fff;
    }
    .article-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #888;
    }
    .badge {
      background: rgba(124, 58, 237, 0.2);
      color: #7c3aed;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge.error {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }
    .filename {
      font-family: monospace;
      font-size: 0.875rem;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 ブログプレビュー</h1>
    <p class="subtitle">ローカルで記事を確認 - ${dir}</p>
    
    <div class="stats">
      <div class="stat">
        <span class="stat-label">記事数</span>
        <span class="stat-value">${articles.length}</span>
      </div>
      <div class="stat">
        <span class="stat-label">エラー</span>
        <span class="stat-value">${articles.filter(a => a.error).length}</span>
      </div>
    </div>
    
    <div class="article-list">
      ${articles.map(article => `
        <a href="/article/${encodeURIComponent(article.filename)}" class="article-card">
          <div class="article-header">
            <div>
              <div class="article-title">${article.title}</div>
              <div class="filename">${article.filename}</div>
            </div>
            ${article.error ? '<span class="badge error">⚠️ Error</span>' : ''}
          </div>
          <div class="article-meta">
            ${article.date ? `<span>📅 ${article.date}</span>` : ''}
            ${article.category ? `<span>📁 ${article.category}</span>` : ''}
          </div>
        </a>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
}

function generateArticleHTML(article, content) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title} - プレビュー</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      line-height: 1.6;
    }
    .preview-header {
      background: rgba(124, 58, 237, 0.1);
      border-bottom: 1px solid rgba(124, 58, 237, 0.3);
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }
    .preview-header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .back-link {
      color: #7c3aed;
      text-decoration: none;
      font-weight: 600;
    }
    .back-link:hover {
      color: #22c55e;
    }
    .preview-badge {
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .article-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    /* 記事内のスタイルはそのまま適用される */
  </style>
</head>
<body>
  <div class="preview-header">
    <div class="preview-header-content">
      <a href="/" class="back-link">← 記事一覧に戻る</a>
      <span class="preview-badge">プレビューモード</span>
    </div>
  </div>
  
  <div class="article-content">
    ${content}
  </div>
</body>
</html>`;
}

// ===================================
// HTTPサーバー
// ===================================

function startServer(port, dir) {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // ルートパス - 記事一覧
    if (pathname === '/') {
      const articles = getArticleList(dir);
      const html = generateIndexHTML(articles, dir);
      
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }
    
    // 記事表示
    if (pathname.startsWith('/article/')) {
      const filename = decodeURIComponent(pathname.replace('/article/', ''));
      const filepath = path.join(dir, filename);
      
      if (!fs.existsSync(filepath)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - File Not Found</h1>');
        return;
      }
      
      const content = fs.readFileSync(filepath, 'utf-8');
      const parsed = parseFrontmatter(content);
      const article = {
        filename,
        title: parsed.meta.title || filename,
      };
      
      const html = generateArticleHTML(article, parsed.body);
      
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }
    
    // 404
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Not Found</h1>');
  });
  
  server.listen(port, () => {
    console.log('');
    console.log('🚀 ブログプレビューサーバー起動');
    console.log('='.repeat(60));
    console.log('');
    console.log(`📂 ディレクトリ: ${path.resolve(dir)}`);
    console.log(`🌐 URL: http://localhost:${port}`);
    console.log('');
    console.log('記事一覧: http://localhost:' + port);
    console.log('');
    console.log('Ctrl+C で終了');
    console.log('');
  });
}

// ===================================
// メイン処理
// ===================================

function main() {
  const args = process.argv.slice(2);
  
  let port = DEFAULT_PORT;
  let dir = DEFAULT_DIR;
  
  // 引数パース
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' || args[i] === '-p') {
      port = parseInt(args[i + 1]) || DEFAULT_PORT;
      i++;
    } else if (!args[i].startsWith('-')) {
      dir = args[i];
    }
  }
  
  // ディレクトリ存在チェック
  if (!fs.existsSync(dir)) {
    console.error(`❌ ディレクトリが見つかりません: ${dir}`);
    console.log('');
    console.log('使い方:');
    console.log('  node blog-preview-server.js');
    console.log('  node blog-preview-server.js content/blog/');
    console.log('  node blog-preview-server.js --port 8080');
    process.exit(1);
  }
  
  startServer(port, dir);
}

main();
