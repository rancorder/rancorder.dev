// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './article.module.css';
import { getAllPosts, getPost, getRelatedPosts } from '@/lib/posts';
import TableOfContents from './TableOfContents';
import ShareButtons from './ShareButtons';
import RelatedArticles from './RelatedArticles';

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

  return (
    <div className={styles.articlePage}>
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

          {/* タグ表示 */}
          {post.tags.length > 0 && (
            <div className={styles.tagList}>
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={styles.tag}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* シェアボタン */}
          <ShareButtons url={currentUrl} title={post.title} />
        </header>

        {/* 2カラムレイアウト */}
        <div className={styles.articleLayout}>
          {/* 目次（サイドバー） */}
          <aside className={styles.sidebar}>
            <div className={styles.stickyToc}>
              <TableOfContents html={post.html} />
            </div>
          </aside>

          {/* メインコンテンツ */}
          <div className={styles.mainContent}>
            <div
              id="content"
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            {/* シェアボタン（記事下） */}
            <div className={styles.shareFooter}>
              <p className={styles.shareText}>この記事が役に立ったらシェアしてください</p>
              <ShareButtons url={currentUrl} title={post.title} />
            </div>
          </div>
        </div>

        {/* 関連記事 */}
        {relatedPosts.length > 0 && (
          <RelatedArticles posts={relatedPosts} />
        )}

        {/* フッター */}
        <footer className={styles.articleFooter}>
          <Link href="/blog" className={styles.backToList}>
            ← すべての記事を見る
          </Link>
        </footer>
      </article>
    </div>
  );
}
