import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogRenderer } from '@/components/blog/blog-renderer';
import BlogLayout from '@/components/BlogLayout';
import { getBlogPost, getBlogSlugs } from '@/lib/blog';
import './blog-post.css';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <BlogLayout
      title={post.title}
      date={post.date}
      readTime={post.readingTime}
      tags={post.tags}
    >
      <BlogRenderer content={post.content} />
    </BlogLayout>
  );
}

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  const canonical = `/blog/${post.slug}`;
  return {
    title: `${post.title} | rancorder`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      url: canonical,
    },
  };
}
