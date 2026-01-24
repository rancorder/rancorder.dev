<div align="center">

# 🚀 Enterprise Portfolio & Blog System

### データベース不要で月100万PVを支える、判断を減らす静的ブログ設計

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**[🌐 Live Demo](https://rancorder.vercel.app)** • **[📝 Blog](https://rancorder.vercel.app/blog)** • **[📚 Docs](#)**

---

### ✨ 判断・依存・迷いを減らした結果、スケールと安定性がついてきた

</div>

---

## 🎯 このシステムの特徴

### 🔥 コアコンセプト

```mermaid
flowchart TD
    A[💡 アイデア] --> B[📝 記事作成<br/>HTML/MDX]
    B --> C[📤 Git Push<br/>GitHub]
    C --> D[⚡ 自動ビルド<br/>2-3分]
    D --> E[🌐 公開完了<br/>Vercel CDN]
    
    F[🚫 DB管理] -.不要.-> G[設定ゼロ]
    H[🚫 サーバー運用] -.不要.-> G
    I[🚫 CMS設定] -.不要.-> G
    
    style A fill:#7c3aed,stroke:#7c3aed,color:#fff
    style E fill:#22c55e,stroke:#22c55e,color:#fff
    style G fill:#64748b,stroke:#64748b,color:#fff
```

| **従来のCMS** | **このシステム** |
|:-------------:|:----------------:|
| ❌ DB必須 | ✅ ファイルベース |
| ❌ サーバー運用 | ✅ 完全静的 |
| ❌ 月額 $20-100 | ✅ **$0** |
| ⚠️ 障害点: DB/サーバー | ✅ 障害点: ビルド時のみ |

---

## 🏗️ アーキテクチャフロー

```mermaid
graph TB
    subgraph "📱 ユーザー"
        U[ブラウザ]
    end
    
    subgraph "🌐 CDN Layer"
        CDN[Vercel Edge Network<br/>完全静的配信]
    end
    
    subgraph "⚡ Build Time (2-3分)"
        BUILD[Static Site Generation]
        BUILD --> SSG1[内部記事<br/>content/blog/*.html]
        BUILD --> SSG2[外部記事<br/>Qiita/Zenn API]
        BUILD --> SSG3[サイトマップ<br/>自動生成]
        BUILD --> SSG4[目次<br/>自動抽出]
    end
    
    subgraph "📁 Content Source"
        GIT[Git Repository]
        GIT --> HTML[HTMLファイル]
        GIT --> MDX[MDXファイル]
        GIT --> META[Frontmatter<br/>メタデータ]
    end
    
    U --> CDN
    CDN --> BUILD
    GIT --> BUILD
    
    style U fill:#3b82f6,color:#fff
    style CDN fill:#22c55e,color:#fff
    style BUILD fill:#7c3aed,color:#fff
    style GIT fill:#64748b,color:#fff
```

### 🔄 記事公開フロー

```mermaid
sequenceDiagram
    participant 👤 Author
    participant 📝 Editor
    participant 🔧 Git
    participant ⚡ Vercel
    participant 🌐 CDN
    participant 👁️ Reader
    
    👤 Author->>📝 Editor: 記事を書く
    📝 Editor->>🔧 Git: git push
    🔧 Git->>⚡ Vercel: Webhook通知
    
    Note over ⚡ Vercel: ビルド開始 (2-3分)
    
    ⚡ Vercel->>⚡ Vercel: 記事を検出
    ⚡ Vercel->>⚡ Vercel: サイトマップ生成
    ⚡ Vercel->>⚡ Vercel: 静的HTML生成
    ⚡ Vercel->>🌐 CDN: デプロイ完了
    
    👁️ Reader->>🌐 CDN: アクセス
    🌐 CDN->>👁️ Reader: 高速配信 ⚡
```

---

## 💎 主要機能

### 📝 ブログシステム

<table>
<tr>
<td width="50%">

**コンテンツ管理**
- ✅ ファイルベースCMS
- ✅ 自動インデックス
- ✅ 自動サイトマップ
- ✅ 外部記事統合
- ✅ Git履歴 = バックアップ

</td>
<td width="50%">

**ユーザー体験**
- ✅ フルテキスト検索
- ✅ タグ・カテゴリフィルタ
- ✅ 目次自動生成
- ✅ 読了時間表示
- ✅ 関連記事提案

</td>
</tr>
</table>

### 🎨 インタラクティブコンポーネント

```mermaid
mindmap
  root((Web Components))
    UI要素
      Callout Box
      Code Block
      Tab Group
      Accordion
    機能
      コピー機能
      折りたたみ
      タブ切り替え
    アニメーション
      Fade-in
      Slide-in
      Scale-in
```

**使用例:**

```html
<!-- Callout Box -->
<callout-box type="success" title="重要ポイント">
  内容をここに書く
</callout-box>

<!-- Code Block with Copy -->
<code-block language="typescript">
const hello = "world";
</code-block>

<!-- Tab Group -->
<tab-group>
  <button data-tab-button>Option 1</button>
  <button data-tab-button>Option 2</button>
  <div data-tab-panel>Content 1</div>
  <div data-tab-panel>Content 2</div>
</tab-group>

<!-- Fade-in Animation -->
<fade-in delay="200">
  <p>段階的に表示される内容</p>
</fade-in>
```

### 🎯 ポートフォリオ機能

```mermaid
graph LR
    A[訪問者] --> B{言語選択}
    B -->|English| C[EN Portfolio]
    B -->|日本語| D[JA Portfolio]
    
    C --> E[Projects]
    C --> F[Skills]
    C --> G[Blog]
    
    D --> H[実績]
    D --> I[スキル]
    D --> J[ブログ]
    
    E --> K[フィルタリング]
    K --> L[Backend]
    K --> M[Frontend]
    K --> N[Infrastructure]
    
    style A fill:#3b82f6,color:#fff
    style C fill:#22c55e,color:#fff
    style D fill:#22c55e,color:#fff
```

---

## 🚀 クイックスタート

### 📦 セットアップフロー

```mermaid
graph LR
    A[📥 Clone] --> B[📦 npm install]
    B --> C[🚀 npm run dev]
    C --> D[🌐 localhost:3000]
    
    style A fill:#7c3aed,color:#fff
    style D fill:#22c55e,color:#fff
```

**コマンド:**

```bash
# 1. リポジトリをクローン
git clone https://github.com/rancorder/portfolio-react-enterprise.git
cd portfolio-react-enterprise

# 2. 依存関係をインストール
npm install

# 3. 開発サーバー起動
npm run dev
```

→ **http://localhost:3000** で開発開始！

---

### 📝 記事追加フロー

```mermaid
graph TD
    A[記事アイデア] --> B{作成方法}
    B -->|自動| C[node scripts/new-post.js]
    B -->|手動| D[ファイル作成]
    
    C --> E[テンプレート生成]
    D --> E
    
    E --> F[記事を書く]
    F --> G[git push]
    G --> H[自動ビルド]
    H --> I[🎉 公開完了]
    
    style A fill:#7c3aed,color:#fff
    style I fill:#22c55e,color:#fff
```

**方法1: 自動生成**

```bash
node scripts/new-post.js "記事タイトル"
# → content/blog/YYYY-MM-DD-title-slug.html 生成
```

**方法2: 手動作成**

```bash
touch content/blog/2026-01-25-my-article.html
# メタデータを追加して git push
git add .
git commit -m "feat: Add new article"
git push
```

**2-3分後に自動デプロイ完了！** 🎉

---

## 📁 プロジェクト構造

```mermaid
graph TB
    ROOT[portfolio-react-enterprise/]
    
    ROOT --> APP[📁 app/]
    ROOT --> CONTENT[📁 content/]
    ROOT --> LIB[📁 lib/]
    ROOT --> PUBLIC[📁 public/]
    ROOT --> SCRIPTS[📁 scripts/]
    
    APP --> BLOG[📁 blog/]
    APP --> JA[📁 ja/]
    APP --> LAYOUT[layout.tsx]
    APP --> PAGE[page.tsx]
    
    BLOG --> SLUG[📁 [slug]/]
    SLUG --> DETAIL[page.tsx]
    
    CONTENT --> ARTICLES[📄 *.html]
    
    LIB --> POSTS[posts.ts]
    LIB --> EXTERNAL[external-articles.ts]
    
    style ROOT fill:#7c3aed,color:#fff
    style APP fill:#3b82f6,color:#fff
    style CONTENT fill:#22c55e,color:#fff
    style LIB fill:#f59e0b,color:#fff
```

**詳細:**

```
portfolio-react-enterprise/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 blog/               # ブログ
│   │   ├── 📁 [slug]/         # 記事詳細
│   │   └── page.tsx           # 記事一覧
│   ├── 📁 ja/                 # 日本語版
│   ├── layout.tsx             # Root Layout
│   └── page.tsx               # トップページ
│
├── 📁 content/blog/           # 記事ファイル
│   ├── 2026-01-20-*.html
│   └── 2026-01-21-*.html
│
├── 📁 lib/                    # ロジック
│   ├── posts.ts               # 記事取得
│   └── external-articles.ts   # 外部統合
│
├── 📁 public/                 # 静的ファイル
│   ├── blog-base.css
│   └── blog-components.js
│
└── 📁 scripts/                # ツール
    └── new-post.js
```

---

## ⚙️ 技術スタック

```mermaid
graph TD
    subgraph "Frontend"
        F1[Next.js 14]
        F2[React 18]
        F3[TypeScript 5.0]
        F4[Framer Motion]
    end
    
    subgraph "Styling"
        S1[CSS Modules]
        S2[CSS Variables]
        S3[Responsive Design]
    end
    
    subgraph "CMS & Data"
        C1[File-based CMS]
        C2[Git Version Control]
        C3[Frontmatter]
    end
    
    subgraph "Deployment"
        D1[Vercel]
        D2[CDN Edge Network]
        D3[Auto Deploy]
    end
    
    F1 --> S1
    F2 --> S2
    C1 --> D1
    
    style F1 fill:#000,color:#fff
    style F2 fill:#61dafb,color:#000
    style F3 fill:#3178c6,color:#fff
    style D1 fill:#000,color:#fff
```

<div align="center">

| **カテゴリ** | **技術** |
|:------------:|:---------|
| **フレームワーク** | Next.js 14 (App Router), React 18 |
| **言語** | TypeScript 5.0 |
| **スタイリング** | CSS Modules, CSS Variables |
| **アニメーション** | Framer Motion |
| **デプロイ** | Vercel (自動デプロイ) |
| **CMS** | File-based (Git) |
| **検索** | クライアントサイド全文検索 |
| **外部統合** | Qiita API, Zenn RSS |

</div>

---

## 🎨 カスタマイズ

### テーマカラー変更フロー

```mermaid
graph LR
    A[globals.css] --> B[CSS Variables]
    B --> C[ダークモード]
    B --> D[ライトモード]
    
    C --> E[--bg: #05070f]
    C --> F[--text: #e2e8f0]
    
    D --> G[--bg: #f8fafc]
    D --> H[--text: #0f172a]
    
    style A fill:#7c3aed,color:#fff
    style C fill:#1e293b,color:#fff
    style D fill:#f8fafc,color:#000
```

**編集: `app/globals.css`**

```css
:root {
  /* ダークモード */
  --bg: #05070f;
  --text: #e2e8f0;
  --accent: #7c3aed;
}

[data-theme='light'] {
  /* ライトモード */
  --bg: #f8fafc;
  --text: #0f172a;
}
```

---

## 📊 パフォーマンス

### Lighthouse スコア

```mermaid
%%{init: {'theme':'base'}}%%
pie title "Lighthouse Scores"
    "Performance" : 95
    "Accessibility" : 100
    "Best Practices" : 100
    "SEO" : 100
```

### Core Web Vitals

```mermaid
gantt
    title Performance Metrics
    dateFormat X
    axisFormat %s
    
    section FCP
    Target (1.8s)     :0, 1800
    Actual (1.2s)     :done, 0, 1200
    
    section LCP
    Target (2.5s)     :0, 2500
    Actual (2.0s)     :done, 0, 2000
    
    section TTI
    Target (3.8s)     :0, 3800
    Actual (2.5s)     :done, 0, 2500
```

| **メトリクス** | **目標** | **実測値** | **評価** |
|:-------------|:--------|:----------|:--------|
| FCP | < 1.8s | **1.2s** | ✅ Good |
| LCP | < 2.5s | **2.0s** | ✅ Good |
| TTI | < 3.8s | **2.5s** | ✅ Good |
| CLS | < 0.1 | **< 0.1** | ✅ Good |
| TBT | < 300ms | **< 200ms** | ✅ Good |

---

## 🌐 デプロイ

### デプロイフロー

```mermaid
sequenceDiagram
    participant 💻 Local
    participant 🔧 GitHub
    participant ⚡ Vercel
    participant 🌐 CDN
    
    💻 Local->>🔧 GitHub: git push
    🔧 GitHub->>⚡ Vercel: Webhook通知
    
    Note over ⚡ Vercel: ビルド開始
    
    ⚡ Vercel->>⚡ Vercel: npm run build
    ⚡ Vercel->>⚡ Vercel: 静的ファイル生成
    ⚡ Vercel->>🌐 CDN: デプロイ
    
    Note over 🌐 CDN: 2-3分で公開完了
    
    🌐 CDN->>🌐 CDN: Edge配信開始 ⚡
```

**コマンド:**

```bash
# GitHubにプッシュ
git push origin main

# → Vercelが自動デプロイ（2-3分）
# → https://your-project.vercel.app
```

---

## 💡 設計思想

```mermaid
mindmap
  root((設計思想))
    依存を減らす
      DB不要
      サーバー不要
      CMS不要
    判断点を消す
      自動検出
      自動生成
      自動デプロイ
    壊れ方を決める
      失敗の隔離
      復旧手順
      監視ポイント
    摩擦をゼロに
      書くだけ
      Push するだけ
      待つだけ
```

### 3つの原則

1. **依存を減らし、判断点を消す**  
   DB・CMS・サーバーという依存を減らし、運用中の「どうする？」を最小化

2. **壊れ方を先に決める**  
   「失敗しない設計」ではなく「失敗しても迷わない設計」

3. **書く以外の摩擦をゼロにする**  
   記事を書く以外の作業が増えた瞬間、ブログは止まる

---

## 🤝 コントリビューション

```mermaid
graph LR
    A[Fork] --> B[Branch]
    B --> C[Commit]
    C --> D[Push]
    D --> E[Pull Request]
    E --> F[Review]
    F --> G[Merge]
    
    style A fill:#7c3aed,color:#fff
    style G fill:#22c55e,color:#fff
```

プルリクエスト歓迎！

1. Fork する
2. Feature ブランチ作成 (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'feat: Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Pull Request を作成

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

---

## 👤 作者

**Rancorder**

- 🌐 Website: [rancorder.vercel.app](https://rancorder.vercel.app)
- 📝 Blog: [rancorder.vercel.app/blog](https://rancorder.vercel.app/blog)
- 💼 GitHub: [@rancorder](https://github.com/rancorder)

---

## 🌟 謝辞

このプロジェクトは以下の技術に支えられています：

- [Next.js](https://nextjs.org/) - React フレームワーク
- [Vercel](https://vercel.com/) - デプロイプラットフォーム
- [Framer Motion](https://www.framer.com/motion/) - アニメーションライブラリ
- [TypeScript](https://www.typescriptlang.org/) - 型安全な開発

---

<div align="center">

### ⭐ このプロジェクトが役に立ったら、Star をお願いします！

**[🚀 Live Demo](https://rancorder.vercel.app)** • **[📝 Blog](https://rancorder.vercel.app/blog)** • **[🐛 Issues](https://github.com/rancorder/portfolio-react-enterprise/issues)**

---

Made with ❤️ and ☕ by **Rancorder**

</div>