#!/usr/bin/env node

/**
 * Frontmatter QA検証ツール
 * システムに組み込まずに、リーダー部分だけをテストする
 * 
 * 使い方:
 *   node frontmatter-qa.js test-cases/
 *   node frontmatter-qa.js single-file.html
 */

const fs = require('fs');
const path = require('path');

// ===================================
// Frontmatter パーサー（スタンドアロン版）
// ===================================

function parseFrontmatter(content) {
  if (!content || content.trim().length === 0) {
    return { meta: {}, body: '', error: null };
  }
  
  // YAML形式（---）
  if (content.trim().startsWith('---')) {
    try {
      // 簡易YAMLパーサー（gray-matter なし）
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
  
  // Frontmatterなし
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
    
    // 空白行
    if (line.trim().length === 0) {
      if (inMultiline) {
        currentValue += '\n';
      }
      continue;
    }
    
    // コメント行
    if (line.trim().startsWith('#')) {
      continue;
    }
    
    // キー:値の行
    const colonIndex = line.indexOf(':');
    
    if (colonIndex > 0 && !inMultiline) {
      // 前のキーを保存
      if (currentKey) {
        meta[currentKey] = parseValue(currentValue.trim());
      }
      
      // 新しいキー
      currentKey = line.substring(0, colonIndex).trim();
      currentValue = line.substring(colonIndex + 1).trim();
      
      // 複数行チェック
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
  
  // 最後のキー
  if (currentKey) {
    meta[currentKey] = parseValue(currentValue.trim());
  }
  
  return meta;
}

function parseValue(value) {
  if (value.length === 0) return '';
  
  // ダブルクォート
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  
  // シングルクォート
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1);
  }
  
  // JSON配列
  if (value.startsWith('[') && value.endsWith(']')) {
    try {
      const cleaned = value.replace(/\s+/g, ' ');
      return JSON.parse(cleaned);
    } catch {
      return value;
    }
  }
  
  // JSONオブジェクト
  if (value.startsWith('{') && value.endsWith('}')) {
    try {
      const cleaned = value.replace(/\s+/g, ' ');
      return JSON.parse(cleaned);
    } catch {
      return value;
    }
  }
  
  // ブール値
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  
  // null
  if (value.toLowerCase() === 'null') return null;
  
  // 数値
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return parseFloat(value);
  }
  
  return value;
}

// ===================================
// テストケース定義
// ===================================

const testCases = [
  {
    name: '空白行が含まれる',
    input: `---
title: "記事タイトル"

date: "2026-01-25"

category: "技術解説"
---

本文`,
    expected: {
      title: '記事タイトル',
      date: '2026-01-25',
      category: '技術解説',
    },
  },
  
  {
    name: '値にコロンが含まれる（URL）',
    input: `---
title: "記事タイトル"
url: "https://example.com:8080/path"
---

本文`,
    expected: {
      title: '記事タイトル',
      url: 'https://example.com:8080/path',
    },
  },
  
  {
    name: 'HTMLコメント形式',
    input: `<!--
title: 記事タイトル
date: 2026-01-25
tags: ["Next.js", "React"]
-->

<!DOCTYPE html>
<html>
<body>本文</body>
</html>`,
    expected: {
      title: '記事タイトル',
      date: '2026-01-25',
      tags: ['Next.js', 'React'],
    },
  },
  
  {
    name: 'クォートなし',
    input: `---
title: 記事タイトル
date: 2026-01-25
category: 技術解説
---

本文`,
    expected: {
      title: '記事タイトル',
      date: '2026-01-25',
      category: '技術解説',
    },
  },
  
  {
    name: '配列が複数行',
    input: `---
title: "記事タイトル"
tags: [
  "Next.js",
  "React",
  "TypeScript"
]
---

本文`,
    expected: {
      title: '記事タイトル',
      tags: ['Next.js', 'React', 'TypeScript'],
    },
  },
  
  {
    name: 'インデントがバラバラ',
    input: `---
  title: "記事タイトル"
date: "2026-01-25"
    category: "技術解説"
---

本文`,
    expected: {
      title: '記事タイトル',
      date: '2026-01-25',
      category: '技術解説',
    },
  },
  
  {
    name: 'Frontmatterなし',
    input: `# 記事タイトル

本文が始まる。`,
    expected: {},
  },
  
  {
    name: '空のFrontmatter',
    input: `---
---

本文`,
    expected: {},
  },
  
  {
    name: 'ブール値と数値',
    input: `---
title: "記事タイトル"
published: true
draft: false
views: 1234
rating: 4.5
---

本文`,
    expected: {
      title: '記事タイトル',
      published: true,
      draft: false,
      views: 1234,
      rating: 4.5,
    },
  },
  
  {
    name: '特殊文字',
    input: `---
title: "記事タイトル: サブタイトル"
excerpt: "これは「テスト」です。"
tags: ["特殊文字!@#$%"]
---

本文`,
    expected: {
      title: '記事タイトル: サブタイトル',
      excerpt: 'これは「テスト」です。',
      tags: ['特殊文字!@#$%'],
    },
  },
];

// ===================================
// QA検証実行
// ===================================

function runTests() {
  console.log('🧪 Frontmatter QA検証開始\n');
  console.log('='.repeat(60));
  console.log('');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    console.log(`[${index + 1}/${testCases.length}] ${testCase.name}`);
    
    const result = parseFrontmatter(testCase.input);
    
    // エラーチェック
    if (result.error) {
      console.log(`  ⚠️  Warning: ${result.error}`);
    }
    
    // 期待値チェック
    let testPassed = true;
    
    for (const [key, expectedValue] of Object.entries(testCase.expected)) {
      const actualValue = result.meta[key];
      
      if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
        console.log(`  ❌ FAIL: ${key}`);
        console.log(`     Expected: ${JSON.stringify(expectedValue)}`);
        console.log(`     Got:      ${JSON.stringify(actualValue)}`);
        testPassed = false;
      } else {
        console.log(`  ✅ PASS: ${key}`);
      }
    }
    
    // 本文チェック
    if (testCase.input.includes('本文') && !result.body.includes('本文')) {
      console.log(`  ❌ FAIL: body does not contain "本文"`);
      testPassed = false;
    } else if (testCase.input.includes('本文')) {
      console.log(`  ✅ PASS: body`);
    }
    
    if (testPassed) {
      passed++;
    } else {
      failed++;
    }
    
    console.log('');
  });
  
  console.log('='.repeat(60));
  console.log(`\n📊 結果: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('🎉 すべてのテストが成功しました！');
  } else {
    console.log('⚠️  一部のテストが失敗しました。');
  }
}

// ===================================
// ファイル検証
// ===================================

function validateFile(filepath) {
  console.log(`\n📄 ファイル検証: ${filepath}\n`);
  console.log('='.repeat(60));
  console.log('');
  
  if (!fs.existsSync(filepath)) {
    console.error(`❌ ファイルが見つかりません: ${filepath}`);
    return;
  }
  
  const content = fs.readFileSync(filepath, 'utf-8');
  const result = parseFrontmatter(content);
  
  console.log('📋 メタデータ:');
  console.log(JSON.stringify(result.meta, null, 2));
  console.log('');
  
  console.log('📝 本文プレビュー:');
  const preview = result.body.substring(0, 200).trim();
  console.log(preview);
  if (result.body.length > 200) {
    console.log('...(省略)');
  }
  console.log('');
  
  if (result.error) {
    console.log(`⚠️  警告: ${result.error}`);
  } else {
    console.log('✅ パース成功');
  }
  
  console.log('');
  console.log('='.repeat(60));
}

function validateDirectory(dirpath) {
  console.log(`\n📁 ディレクトリ検証: ${dirpath}\n`);
  
  const files = fs.readdirSync(dirpath);
  const targetFiles = files.filter(f => 
    f.endsWith('.html') || f.endsWith('.md') || f.endsWith('.mdx')
  );
  
  console.log(`対象ファイル: ${targetFiles.length}件\n`);
  
  let success = 0;
  let errors = 0;
  
  targetFiles.forEach((file, index) => {
    const filepath = path.join(dirpath, file);
    const content = fs.readFileSync(filepath, 'utf-8');
    const result = parseFrontmatter(content);
    
    const status = result.error ? '⚠️ ' : '✅';
    console.log(`${status} [${index + 1}/${targetFiles.length}] ${file}`);
    
    if (result.error) {
      console.log(`     Error: ${result.error}`);
      errors++;
    } else {
      console.log(`     Title: ${result.meta.title || '(なし)'}`);
      console.log(`     Date:  ${result.meta.date || '(なし)'}`);
      success++;
    }
    console.log('');
  });
  
  console.log('='.repeat(60));
  console.log(`\n📊 結果: ${success} success, ${errors} errors\n`);
}

// ===================================
// メイン処理
// ===================================

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // 引数なし → テストケース実行
    runTests();
  } else {
    const target = args[0];
    
    if (fs.statSync(target).isDirectory()) {
      // ディレクトリ
      validateDirectory(target);
    } else {
      // 単一ファイル
      validateFile(target);
    }
  }
}

main();
