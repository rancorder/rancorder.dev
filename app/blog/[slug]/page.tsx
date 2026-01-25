// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './article.module.css';
import { getAllPosts, getPost, getRelatedPosts } from '@/lib/posts';
import { extractHeadings } from '@/lib/extractHeadings';
import TableOfContents from './TableOfContents';
import ShareButtons from './ShareButtons';
import RelatedArticles from './RelatedArticles';
import ArticleEffects from './ArticleEffects'; // ★ 追加

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.title} | Technical Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post, 3);
  const currentUrl = `https://rancorder.vercel.app/blog/${post.slug}`;

  // ★ HTML を 1 回だけ解析して TOC を作る
  const toc = extractHeadings(post.html);

  return (
    <div className={styles.articlePage}>

      {/* ★ 記事ごとの JS を自動読み込み（F5 不要で動く） */}
      <ArticleEffects slug={post.slug} />

      <article className={styles.articleContainer}>
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blog
        </Link>

        {/* Hero Header */}
        <header className={styles.articleHero} aria-label="記事の概要">
          <div className={styles.metaRow}>
            <span className={styles.badge}>
              <strong>{post.category}</strong>
            </span>
            <span className={styles.metaText}>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span className={styles.dot}>•</span>
              <span>{post.readingTime}</span>
            </span>
          </div>

          <h1 className={styles.heroTitle}>{post.title}</h1>
          <p className={styles.heroDek}>{post.excerpt}</p>

          <ShareButtons url={currentUrl} title={post.title} />
        </header>

        {/* 2カラムレイアウト */}
        <div className={styles.articleLayout}>
          {/* 目次（サイドバー） */}
          <aside className={styles.sidebar}>
            <div className={styles.stickyToc}>
              <TableOfContents toc={toc} /> {/* ★ HTML を渡さない */}
            </div>
          </aside>

          {/* メインコンテンツ */}
          <div className={styles.mainContent}>
            <div
              id="content"
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: post.html }} // ★ HTML はここだけ
            />

            <div className={styles.shareFooter}>
              <p className={styles.shareText}>この記事が役に立ったらシェアしてください</p>
              <ShareButtons url={currentUrl} title={post.title} />
            </div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <RelatedArticles posts={relatedPosts} />
        )}

        <footer className={styles.articleFooter}>
          <Link href="/blog" className={styles.backToList}>
            ← すべての記事を見る
          </Link>
        </footer>
      </article>
    </div>
  );
}
