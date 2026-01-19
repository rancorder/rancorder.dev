#!/usr/bin/env node
// scripts/new-post.js
// Usage: node scripts/new-post.js "記事タイトル"

const fs = require('fs');
const path = require('path');

// コマンドライン引数から記事タイトルを取得
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Error: Please provide a post title');
  console.log('Usage: node scripts/new-post.js "Your Post Title"');
  process.exit(1);
}

const title = args.join(' ');

// 日付とスラッグを生成
const now = new Date();
const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-') // 英数字以外をハイフンに
  .replace(/^-+|-+$/g, ''); // 前後のハイフンを削除

const fileName = `${date}-${slug}.html`;
const filePath = path.join(process.cwd(), 'content', 'blog', fileName);

// テンプレート生成
const template = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/blog-base.css">
  <script type="module" src="/blog-components.js"></script>
</head>
<body>
  <!--
  title: ${title}
  date: ${now.toISOString()}
  excerpt: 記事の概要をここに書く
  category: Technical
  readingTime: 5 min read
  -->

  <article>
    <header>
      <h1>${title}</h1>
      <p><strong>この記事の要約を書く</strong></p>
    </header>

    <hr />

    <!-- ここから記事本文 -->

    <section>
      <h2>はじめに</h2>
      <p>記事の導入部分を書く</p>
      
      <callout-box type="info" title="ポイント">
        重要なポイントをここに書く
      </callout-box>
    </section>

    <section>
      <h2>主要なセクション</h2>
      <p>内容を書く</p>
      
      <h3>サブセクション</h3>
      <ul>
        <li>項目1</li>
        <li>項目2</li>
        <li>項目3</li>
      </ul>
    </section>

    <section>
      <h2>コード例</h2>
      
      <code-block language="javascript">
// サンプルコード
const hello = "world";
console.log(hello);
      </code-block>
    </section>

    <section>
      <h2>比較表</h2>
      <table>
        <thead>
          <tr>
            <th>項目</th>
            <th>Before</th>
            <th>After</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>速度</td>
            <td>遅い</td>
            <td>高速</td>
          </tr>
          <tr>
            <td>保守性</td>
            <td>低い</td>
            <td>高い</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>インタラクティブチェックリスト</h2>
      <interactive-checklist>
        <ul>
          <li>タスク1を完了する</li>
          <li>タスク2を確認する</li>
          <li>タスク3をテストする</li>
        </ul>
      </interactive-checklist>
    </section>

    <section>
      <h2>タブ切り替え例</h2>
      <tab-group>
        <div class="tab-buttons">
          <button data-tab-button>オプション1</button>
          <button data-tab-button>オプション2</button>
          <button data-tab-button>オプション3</button>
        </div>
        <div data-tab-panel>
          <p>オプション1の内容</p>
        </div>
        <div data-tab-panel>
          <p>オプション2の内容</p>
        </div>
        <div data-tab-panel>
          <p>オプション3の内容</p>
        </div>
      </tab-group>
    </section>

    <section>
      <h2>アコーディオン例</h2>
      <accordion-item title="詳細情報を表示">
        <p>追加の詳細情報をここに書く</p>
      </accordion-item>
    </section>

    <section>
      <h2>プログレスバー例</h2>
      <progress-bar value="75" max="100" label="完了度"></progress-bar>
    </section>

    <section>
      <h2>まとめ</h2>
      
      <callout-box type="success" title="成果">
        この記事で達成したことをまとめる
      </callout-box>
      
      <p>最終的な結論を書く</p>
    </section>

    <hr />

    <footer>
      <p>参考リンク：</p>
      <ul>
        <li><a href="#">リンク1</a></li>
        <li><a href="#">リンク2</a></li>
      </ul>
    </footer>
  </article>

</body>
</html>
`;

// ディレクトリが存在しない場合は作成
const blogDir = path.join(process.cwd(), 'content', 'blog');
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// ファイルを作成
try {
  fs.writeFileSync(filePath, template, 'utf8');
  console.log('✅ Created new post:');
  console.log(`   File: ${fileName}`);
  console.log(`   Path: ${filePath}`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Edit the file and write your content');
  console.log('   2. Update the excerpt in the HTML comment');
  console.log('   3. Git commit and push');
  console.log('   4. Your post will be live in 2-3 minutes!');
} catch (error) {
  console.error('❌ Error creating file:', error.message);
  process.exit(1);
}
