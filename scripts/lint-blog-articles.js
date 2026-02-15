#!/usr/bin/env node
// scripts/lint-blog-articles.js
// Tier 2 制約違反検出スクリプト

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tier 2 違反パターン
const TIER2_VIOLATIONS = [
  {
    pattern: /<form[\s>]/gi,
    message: 'Tier 2 violation: <form> tag detected',
    severity: 'error'
  },
  {
    pattern: /\blocalStorage\b/g,
    message: 'Tier 2 violation: localStorage usage',
    severity: 'error'
  },
  {
    pattern: /\bsessionStorage\b/g,
    message: 'Tier 2 violation: sessionStorage usage',
    severity: 'error'
  },
  {
    pattern: /\bfetch\s*\(/g,
    message: 'Tier 2 violation: fetch() detected (may be false positive in comments)',
    severity: 'warning' // false positive の可能性があるため warning
  },
  {
    pattern: /\bXMLHttpRequest\b/g,
    message: 'Tier 2 violation: XMLHttpRequest usage',
    severity: 'error'
  },
  {
    pattern: /<script\s+src\s*=\s*["']https?:\/\//gi,
    message: 'Tier 2 violation: external <script> tag detected',
    severity: 'error'
  },
  {
    pattern: /\beval\s*\(/g,
    message: 'Tier 2 violation: eval() usage (security risk)',
    severity: 'error'
  }
];

/**
 * 記事のメタデータから tier を抽出
 */
function extractTier(content) {
  const metaMatch = content.match(/<!--[\s\S]*?-->/);
  if (!metaMatch) return null;
  
  const tierMatch = metaMatch[0].match(/tier:\s*(\d+)/);
  return tierMatch ? parseInt(tierMatch[1]) : null;
}

/**
 * 記事ファイルを解析
 */
async function lintArticle(filepath) {
  const content = await fs.readFile(filepath, 'utf-8');
  const violations = [];
  const tier = extractTier(content);
  
  // tier: 3 宣言がある場合はスキップ
  if (tier === 3) {
    return { filepath, tier, violations: [], skipped: true };
  }
  
  // tier 未宣言の場合は警告
  if (tier === null) {
    violations.push({
      severity: 'warning',
      message: 'No tier declaration found (assuming tier: 1)'
    });
  }
  
  // Tier 2 違反パターンをチェック
  for (const { pattern, message, severity } of TIER2_VIOLATIONS) {
    const matches = content.match(pattern);
    if (matches) {
      violations.push({
        severity,
        message: `${message} (${matches.length} occurrence${matches.length > 1 ? 's' : ''})`
      });
    }
  }
  
  return { filepath, tier, violations, skipped: false };
}

/**
 * メイン処理
 */
async function main() {
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  
  // content/blog ディレクトリの存在確認
  try {
    await fs.access(contentDir);
  } catch {
    console.error(`❌ Directory not found: ${contentDir}`);
    console.error('   Run this script from the project root.');
    process.exit(1);
  }
  
  // HTML ファイルを取得
  const files = await fs.readdir(contentDir);
  const htmlFiles = files
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(contentDir, file));
  
  if (htmlFiles.length === 0) {
    console.log('ℹ️  No HTML files found in content/blog/');
    process.exit(0);
  }
  
  // すべての記事を解析
  const results = await Promise.all(htmlFiles.map(lintArticle));
  
  // 結果を集計
  const errors = results.filter(r => !r.skipped && r.violations.some(v => v.severity === 'error'));
  const warnings = results.filter(r => !r.skipped && r.violations.some(v => v.severity === 'warning'));
  const tier3Articles = results.filter(r => r.skipped);
  
  // 結果を表示
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Tier Classification Results');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log(`Total articles: ${results.length}`);
  console.log(`  🟢 Tier 1/2 compliant: ${results.length - errors.length - tier3Articles.length}`);
  console.log(`  🟡 Warnings: ${warnings.length}`);
  console.log(`  🔴 Tier 2 violations: ${errors.length}`);
  console.log(`  ⚪ Tier 3 (skipped): ${tier3Articles.length}\n`);
  
  // Tier 3 記事の表示
  if (tier3Articles.length > 0) {
    console.log('⚪ Tier 3 Articles (保証外として公開):');
    tier3Articles.forEach(r => {
      console.log(`  📄 ${path.basename(r.filepath)}`);
    });
    console.log('');
  }
  
  // 警告の表示
  if (warnings.length > 0) {
    console.log('🟡 Warnings:');
    warnings.forEach(r => {
      console.log(`  📄 ${path.basename(r.filepath)}`);
      r.violations.filter(v => v.severity === 'warning').forEach(v => {
        console.log(`     ⚠️  ${v.message}`);
      });
      console.log('');
    });
  }
  
  // エラーの表示
  if (errors.length > 0) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔴 Tier 2 制約違反が検出されました');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    errors.forEach(r => {
      console.log(`  📄 ${path.basename(r.filepath)}`);
      if (r.tier) {
        console.log(`     宣言: tier: ${r.tier}`);
      }
      r.violations.filter(v => v.severity === 'error').forEach(v => {
        console.log(`     ❌ ${v.message}`);
      });
      console.log('');
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('次の選択肢があります：');
    console.log('  1️⃣  制約を守った実装に修正する（Tier 2 維持）');
    console.log('  2️⃣  記事冒頭のメタデータに tier: 3 を明記する');
    console.log('');
    console.log('例：');
    console.log('  <!--');
    console.log('  title: 記事タイトル');
    console.log('  tier: 3');
    console.log('  -->');
    console.log('');
    console.log('⚠️  tier: 3 を宣言すると、この記事は「保証外」となります。');
    console.log('   記事内に <callout-box type="warning"> で注意書きを');
    console.log('   追加することを推奨します。');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(1); // 常に失敗させる（これは降格通知である）
  }
  
  console.log('✅ すべての記事が Tier 1/2 準拠です\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
