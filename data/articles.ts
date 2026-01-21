// data/articles.ts
export type ExternalArticle = {
  id: string;
  title: string;
  link: string;
  platform: "qiita" | "zenn" | "note";
  published_at?: string;
  tags?: string[];
};

export const articles: ExternalArticle[] = [
  {
    id: "sample-1",
    title: "スクレイピングはPython一択？——盲点は「常駐×並列×ブラウザ」だった",
    link: "https://qiita.com/rancorder/items/xxxx",
    platform: "qiita",
    published_at: "2026-01-01",
    tags: ["スクレイピング", "Node.js", "Python"],
  },
];