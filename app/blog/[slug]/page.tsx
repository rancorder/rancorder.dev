import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import BlogRenderer from '@/components/blog/blog-renderer';
import BlogLayout from '@/components/BlogLayout';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// 記事メタデータの型
interface PostMetadata {
  title: string;
  date: string;
  readTime?: string;
  tags?: string[];
}

// メタデータを抽出する関数
function extractMetadata(html: string): PostMetadata {
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"/);
  const tagsMatch = html.match(/<meta name="keywords" content="([^"]+)"/);
  const readTimeMatch = html.match(/<meta name="reading-time" content="([^"]+)"/);

  return {
    title: titleMatch ? titleMatch[1] : 'Untitled',
    date: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0],
    readTime: readTimeMatch ? readTimeMatch[1] : undefined,
    tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : undefined,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const filePath = path.join(contentDir, `${slug}.html`);

  // ファイルが存在しない場合は404
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // HTMLを読み込む
  const htmlContent = fs.readFileSync(filePath, 'utf-8');

  // メタデータを抽出
  const metadata = extractMetadata(htmlContent);

  return (
    <BlogLayout
      title={metadata.title}
      date={metadata.date}
      readTime={metadata.readTime}
      tags={metadata.tags}
    >
      <BlogRenderer htmlContent={htmlContent} />
    </BlogLayout>
  );
}

// 静的生成のためのパスを生成
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  
  // ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir);
  
  return files
    .filter(file => file.endsWith('.html'))
    .map(file => ({
      slug: file.replace('.html', ''),
    }));
}
