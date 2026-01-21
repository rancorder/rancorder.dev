// data/articles.ts
export type ArticleSource = 'Qiita' | 'Zenn' | 'note' | 'Blog';

export type Article = {
  title: string;
  link: string;           // 外部なら https://〜、内部なら /blog/slug でもOK
  slug?: string;          // 内部詳細ページがある場合だけ
  excerpt?: string;
  date?: string;          // "YYYY-MM-DD" 推奨（他形式でも一応OK）
  category?: string;
  readingTime?: string;   // "5 min" など
  platform?: ArticleSource;
};

export const articles: Article[] = [
  {
    title: 'スクレイピングはPython一択？——盲点は「常駐×並列×ブラウザ」だった',
    link: 'https://qiita.com/rancorder/items/xxxxxxxxxxxx',
    platform: 'Qiita',
    date: '2026-01-01',
    category: 'Scraping',
    excerpt: '常駐・並列・ブラウザ制御を前提にすると、選択肢が変わる話。',
    readingTime: '6 min',
  },
  // ここに増やしていく
];