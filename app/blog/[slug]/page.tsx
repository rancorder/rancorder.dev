// app/blog/[slug]/page.tsx
import { getPost } from '@/lib/posts';
import { notFound } from 'next/navigation';

export default async function BlogPost({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  const post = getPost(slug);
  
  if (!post) {
    notFound();
  }
  
  // 記事HTMLをそのまま返す（余計なラッパーなし）
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: post.html }}
      suppressHydrationWarning
    />
  );
}

// メタデータ生成
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}) {
  const resolvedParams = await Promise.resolve(params);
  const post = getPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: '記事が見つかりません',
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
  };
}
