# シンプルブログシステム

## 📁 構造

```
blog/
├── index.html              # トップページ（記事一覧）
├── style.css               # 全ページ共通CSS
├── blog.js                 # 自動読み込み・エフェクトスクリプト
└── posts/                  # 記事フォルダ
    ├── posts.json          # 記事リスト
    └── *.html              # 個別記事ファイル
```

## ✨ 機能

- ✅ **自動記事一覧生成**：posts.jsonから自動で一覧作成
- ✅ **タブ切り替え**：ホバー・クリックエフェクト付き
- ✅ **アコーディオン**：スムーズな開閉アニメーション
- ✅ **コードコピーボタン**：ワンクリックでコピー
- ✅ **フェードインアニメーション**：スクロールで要素が表示
- ✅ **吹き出し（Callout）**：情報・警告・成功・エラー
- ✅ **レスポンシブ対応**：モバイルでも快適

## 🚀 使い方

### 1. 新しい記事を追加

**Step 1**: `posts/` フォルダに新しいHTMLファイルを作成

```html
<!-- posts/2024-01-23-new-article.html -->
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>新しい記事タイトル</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <header>
    <nav><a href="../index.html">← ホーム</a></nav>
  </header>

  <main>
    <article>
      <h1 class="fade-in-scroll">新しい記事のタイトル</h1>
      <time class="fade-in-scroll">2024-01-23</time>
      
      <p class="fade-in-scroll">記事の本文...</p>
    </article>
  </main>

  <script src="../blog.js"></script>
</body>
</html>
```

**Step 2**: `posts/posts.json` に追加

```json
{
  "title": "新しい記事のタイトル",
  "date": "2024-01-23",
  "file": "2024-01-23-new-article.html",
  "excerpt": "記事の要約文"
}
```

### 2. エフェクトの使い方

#### タブ

```html
<div class="tab-group">
  <div class="tab-buttons">
    <button class="tab-button">タブ1</button>
    <button class="tab-button">タブ2</button>
  </div>
  <div class="tab-panel">
    <p>タブ1の内容</p>
  </div>
  <div class="tab-panel">
    <p>タブ2の内容</p>
  </div>
</div>
```

#### アコーディオン

```html
<div class="accordion">
  <div class="accordion-header">
    <span>クリックして開く</span>
    <span class="accordion-icon">▼</span>
  </div>
  <div class="accordion-content">
    <div class="accordion-body">
      <p>隠れている内容</p>
    </div>
  </div>
</div>
```

#### コードブロック

```html
<div class="code-block">
<code>const hello = 'world';
console.log(hello);</code>
</div>
```

#### 吹き出し

```html
<!-- 情報 -->
<div class="callout callout-info">
  <strong>💡 ポイント</strong>
  <p>重要な情報</p>
</div>

<!-- 警告 -->
<div class="callout callout-warning">
  <strong>⚠️ 注意</strong>
  <p>注意事項</p>
</div>

<!-- 成功 -->
<div class="callout callout-success">
  <strong>✅ 成功</strong>
  <p>成功メッセージ</p>
</div>

<!-- エラー -->
<div class="callout callout-error">
  <strong>❌ エラー</strong>
  <p>エラーメッセージ</p>
</div>
```

#### スクロールでフェードイン

```html
<h2 class="fade-in-scroll">見出し</h2>
<p class="fade-in-scroll">テキスト</p>
```

## 📦 デプロイ

### GitHub Pages

```bash
git add .
git commit -m "Add new post"
git push origin main
```

Settings → Pages → Source: main branch

### Netlify

1. フォルダをドラッグ&ドロップ
2. または GitHub連携で自動デプロイ

### Vercel

```bash
vercel --prod
```

## 🔧 カスタマイズ

### 色を変える

`style.css` の色変数を編集：

```css
/* 青系から赤系に変更する例 */
#60a5fa → #ef4444  /* プライマリカラー */
#93c5fd → #f87171  /* ホバーカラー */
```

### エフェクトを調整

`style.css` のアニメーション時間を変更：

```css
transition: all 0.3s ease;  /* 0.3s を 0.5s に変更など */
```

## 📝 ライセンス

MIT License - 自由に使ってください

## 🙏 サポート

問題があれば Issue を立ててください
