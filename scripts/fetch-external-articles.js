// scripts/fetch-external-articles.js
const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * HTTPSリクエストでJSONを取得
 */
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Node.js)',
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}: ${url}`));
            return;
          }
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Failed to parse JSON from ${url}: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * テキストから見出しを抽出（最初の文または最初の見出し）
 */
function extractExcerpt(text, maxLength = 150) {
  if (!text) return '';
  
  // Markdown記号を削除
  let cleaned = text
    .replace(/```[\s\S]*?```/g, '') // コードブロックを削除
    .replace(/`[^`]+`/g, '')         // インラインコードを削除
    .replace(/!\[.*?\]\(.*?\)/g, '') // 画像を削除
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // リンクをテキストのみに
    .replace(/^#+\s+/gm, '')         // 見出し記号を削除
    .replace(/[*_~]/g, '')           // 強調記号を削除
    .replace(/\n+/g, ' ')            // 改行をスペースに
    .trim();
  
  // 最初の文を取得（句点まで、または最大文字数）
  const firstSentence = cleaned.split(/[。．.!?！？]/)[0];
  
  if (firstSentence.length > maxLength) {
    return firstSentence.substring(0, maxLength) + '...';
  }
  
  return firstSentence + '...';
}

/**
 * Qiitaから記事を取得
 */
async function fetchQiitaArticles(username) {
  try {
    console.log(`📗 Fetching Qiita articles for ${username}...`);
    const url = `https://qiita.com/api/v2/users/${username}/items?per_page=20`;
    const data = await fetchJSON(url);
    
    const articles = data.map(item => {
      // bodyから適切な抜粋を作成
      const excerpt = extractExcerpt(item.body, 150);
      
      return {
        title: item.title,
        link: item.url,
        date: item.created_at,
        source: 'Qiita',
        excerpt: excerpt || 'Qiitaで公開された技術記事です。',
        tags: (item.tags || []).slice(0, 3).map(t => t.name).join(', '),
        likes: item.likes_count || 0,
      };
    });
    
    console.log(`✅ Fetched ${articles.length} Qiita articles`);
    return articles;
  } catch (error) {
    console.error('❌ Failed to fetch Qiita articles:', error.message);
    return [];
  }
}

/**
 * 個別のZenn記事の詳細を取得
 */
async function fetchZennArticleDetail(username, slug) {
  try {
    const url = `https://zenn.dev/api/articles/${username}/${slug}`;
    const data = await fetchJSON(url);
    return data.article;
  } catch (error) {
    console.warn(`  ⚠️  Failed to fetch detail for ${slug}`);
    return null;
  }
}

/**
 * Zennから記事を取得
 */
async function fetchZennArticles(username) {
  try {
    console.log(`⚡ Fetching Zenn articles for ${username}...`);
    const url = `https://zenn.dev/api/articles?username=${username}&order=latest`;
    const data = await fetchJSON(url);
    
    const articleList = (data.articles || []).slice(0, 20);
    
    // 各記事の詳細を取得（並行処理で高速化）
    console.log(`   Fetching details for ${articleList.length} articles...`);
    const articlesWithDetails = await Promise.all(
      articleList.map(async (item) => {
        // 詳細取得を試みる（失敗してもスキップ）
        const detail = await fetchZennArticleDetail(username, item.slug);
        
        // 抜粋を作成
        let excerpt = '';
        if (detail && detail.body_markdown) {
          excerpt = extractExcerpt(detail.body_markdown, 150);
        } else if (item.body_letters_count) {
          excerpt = `${item.emoji || '📝'} この記事は約${item.body_letters_count}文字の技術記事です。`;
        } else {
          excerpt = `${item.emoji || '📝'} Zennで公開された技術記事です。`;
        }
        
        return {
          title: item.title,
          link: `https://zenn.dev${item.path}`,
          date: item.published_at || item.created_at,
          source: 'Zenn',
          excerpt: excerpt,
          emoji: item.emoji || '📝',
          likes: item.liked_count || 0,
        };
      })
    );
    
    console.log(`✅ Fetched ${articlesWithDetails.length} Zenn articles`);
    return articlesWithDetails;
  } catch (error) {
    console.error('❌ Failed to fetch Zenn articles:', error.message);
    return [];
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('\n🚀 Starting external articles fetch...\n');
  
  const qiitaUsername = 'rancorder';
  const zennUsername = 'supermassu';
  
  // 並行取得
  const [qiitaArticles, zennArticles] = await Promise.all([
    fetchQiitaArticles(qiitaUsername),
    fetchZennArticles(zennUsername),
  ]);
  
  // 統合して日付順にソート
  const allArticles = [...qiitaArticles, ...zennArticles]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  console.log(`\n📊 Summary:`);
  console.log(`   Qiita: ${qiitaArticles.length} articles`);
  console.log(`   Zenn:  ${zennArticles.length} articles`);
  console.log(`   Total: ${allArticles.length} articles\n`);
  
  // JSONファイルに保存
  const outputPath = path.join(process.cwd(), 'public', 'external-articles.json');
  
  // publicディレクトリが存在しない場合は作成
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // ファイルに書き込み
  fs.writeFileSync(outputPath, JSON.stringify(allArticles, null, 2), 'utf-8');
  
  console.log(`💾 Saved to: ${outputPath}`);
  console.log(`✨ Done!\n`);
  
  // 0件の場合は警告
  if (allArticles.length === 0) {
    console.warn('⚠️  Warning: No articles were fetched. Please check:');
    console.warn('   - Username is correct');
    console.warn('   - Network connection');
    console.warn('   - API availability');
  }
  
  // サンプル表示（デバッグ用）
  if (allArticles.length > 0) {
    console.log('\n📝 Sample article:');
    const sample = allArticles[0];
    console.log(`   Title: ${sample.title}`);
    console.log(`   Excerpt: ${sample.excerpt.substring(0, 80)}...`);
    console.log(`   Source: ${sample.source}`);
  }
}

// 実行
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
