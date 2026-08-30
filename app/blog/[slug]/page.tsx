import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogRenderer } from '@/components/blog/blog-renderer';
import BlogLayout from '@/components/BlogLayout';
import { getAllBlogPosts, getBlogPost, getBlogSlugs, type BlogPost } from '@/lib/blog';
import './blog-post.css';

interface BlogPostPageProps { params: { slug: string } }

function classify(post: BlogPost) {
  const s=[post.title,post.category||'',...post.tags].join(' ').toLowerCase();
  if(/dx|業務変革|業務改善|デジタル|導入|定着|業務フロー/.test(s)) return 'DX';
  if(/自動化|automation|監視|運用|reliab|障害|復旧|scrap|crawler|テスト/.test(s)) return 'REL';
  if(/poc|本番|production|ai|llm|whisper|bert|api|aws/.test(s)) return 'P2P';
  return 'DEC';
}

function relatedPosts(current: BlogPost) {
  const all=getAllBlogPosts().filter(p=>p.slug!==current.slug);
  const currentWords=new Set([classify(current),...current.tags.map(t=>t.toLowerCase())]);
  return all.map(post=>{
    const words=[classify(post),...post.tags.map(t=>t.toLowerCase())];
    const score=words.reduce((n,w)=>n+(currentWords.has(w)?2:0),0)+(classify(post)===classify(current)?3:0);
    return {post,score};
  }).sort((a,b)=>b.score-a.score||b.post.date.localeCompare(a.post.date)).slice(0,3).map(x=>x.post);
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post=getBlogPost(params.slug);
  if(!post) notFound();
  const related=relatedPosts(post);
  const canonical=`https://rancorder.dev/blog/${post.slug}`;
  const articleSchema={
    '@context':'https://schema.org',
    '@type':'BlogPosting',
    '@id':canonical+'#article',
    headline:post.title,
    description:post.excerpt,
    datePublished:post.date,
    dateModified:post.date,
    inLanguage:'ja-JP',
    mainEntityOfPage:canonical,
    url:canonical,
    keywords:post.tags.join(', '),
    articleSection:classify(post),
    author:{'@id':'https://rancorder.dev/#profile'},
    publisher:{'@id':'https://rancorder.dev/#profile'},
    isPartOf:{'@id':'https://rancorder.dev/#website'},
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema)}} />
      <BlogLayout title={post.title} date={post.date} readTime={post.readingTime} tags={post.tags}
      category={classify(post)}
      related={related.map((p,i)=>({slug:p.slug,title:p.title,category:classify(p),readTime:p.readingTime,xp:140+i*20}))}>
      <BlogRenderer content={post.content}/>
      </BlogLayout>
    </>
  );
}

export function generateStaticParams(){return getBlogSlugs().map(slug=>({slug}));}

export function generateMetadata({params}:BlogPostPageProps):Metadata{
  const post=getBlogPost(params.slug); if(!post)return {};
  const canonical=`/blog/${post.slug}`;
  return {title:`${post.title} | rancorder`,description:post.excerpt,keywords:post.tags,alternates:{canonical},
    openGraph:{title:post.title,description:post.excerpt,type:'article',publishedTime:post.date,tags:post.tags,url:canonical}};
}
