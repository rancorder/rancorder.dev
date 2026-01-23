'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './blog.module.css';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  tags: string[];
}

interface ExternalArticle {
  source?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  link?: string;
  url?: string;
  slug?: string;
}

interface BlogPageClientProps {
  initialPosts: BlogPost[];
  allTags: { tag: string; count: number }[];
  allCategories: string[];
  externalArticles: ExternalArticle[];
}

function formatDateSafe(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getExternalHref(a: ExternalArticle) {
  return a.url || a.link || '';
}

function getExternalKey(a: ExternalArticle, fallbackIndex: number) {
  return a.slug || a.url || a.link || `${a.source || 'ext'}-${fallbackIndex}`;
}

function normalizeSourceLabel(source?: string) {
  if (!source) return 'External';
  const s = source.toLowerCase();
  if (s === 'qiita') return 'Qiita';
  if (s === 'zenn') return 'Zenn';
  if (s === 'note') return 'note';
  if (s === 'github') return 'GitHub';
  return source;
}

function toPlatformClass(source?: string) {
  const s = (source || '').trim();
  return s ? `platform${s}` : 'platformExternal';
}

export default function BlogPageClient({
  initialPosts,
  allTags,
  allCategories,
  externalArticles,
}: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // フィルタリングロジック
  const filteredPosts = useMemo(() => {
    let results = initialPosts;

    // 検索クエリでフィルタ
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // タグでフィルタ
    if (selectedTag) {
      results = results.filter(post =>
        post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // カテゴリでフィルタ
    if (selectedCategory) {
      results = results.filter(
        post => post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return results;
  }, [initialPosts, searchQuery, selectedTag, selectedCategory]);

  // フィルタをリセット
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
    setSelectedCategory(null);
  };

  const hasActiveFilters = searchQuery || selectedTag || selectedCategory;

  return (
    <div className={styles.blogPage}>
      <div className={styles.container}>
        {/* ヘッダー */}
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.title}>Technical Blog</h1>
          <p className={styles.subtitle}>
            Deep dives into enterprise PM, decision design, and production-grade systems
          </p>
        </header>

        {/* 検索バー */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={styles.clearButton}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* フィルタ表示 */}
          {hasActiveFilters && (
            <div className={styles.activeFilters}>
              <span className={styles.filterLabel}>Active filters:</span>
              {searchQuery && (
                <span className={styles.filterTag}>
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>✕</button>
                </span>
              )}
              {selectedTag && (
                <span className={styles.filterTag}>
                  Tag: {selectedTag}
                  <button onClick={() => setSelectedTag(null)}>✕</button>
                </span>
              )}
              {selectedCategory && (
                <span className={styles.filterTag}>
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory(null)}>✕</button>
                </span>
              )}
              <button onClick={resetFilters} className={styles.resetButton}>
                Reset all
              </button>
            </div>
          )}
        </div>

        {/* タグクラウド */}
        {allTags.length > 0 && (
          <section className={styles.tagsSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>🏷️</span>
              Popular Tags
            </h2>
            <div className={styles.tagCloud}>
              {allTags.slice(0, 20).map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`${styles.tagButton} ${selectedTag === tag ? styles.tagActive : ''}`}
                >
                  {tag} <span className={styles.tagCount}>({count})</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* カテゴリフィルタ */}
        {allCategories.length > 0 && (
          <section className={styles.categoriesSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>📁</span>
              Categories
            </h2>
            <div className={styles.categoryList}>
              {allCategories.map(category => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category ? null : category)
                  }
                  className={`${styles.categoryButton} ${
                    selectedCategory === category ? styles.categoryActive : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Featured Articles（内部記事） */}
        <section className={styles.section}>
          <div className={styles.articleHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>📝</span>
              {hasActiveFilters ? 'Search Results' : 'Featured Articles'}
            </h2>
            <span className={styles.resultCount}>
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyIcon}>🔍</p>
              <p className={styles.emptyText}>No articles found matching your filters.</p>
              <button onClick={resetFilters} className={styles.emptyButton}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.featuredCard}>
                  <div className={styles.cardMeta}>
                    <span className={styles.category}>{post.category}</span>
                    <span className={styles.date}>{formatDateSafe(post.date) || ''}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>

                  {/* タグ表示 */}
                  {post.tags.length > 0 && (
                    <div className={styles.cardTags}>
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.cardTag}>
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className={styles.cardTag}>+{post.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <span className={styles.readTime}>{post.readingTime}</span>
                    <span className={styles.arrow}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* External Articles（Qiita/Zenn/note/...） */}
        {externalArticles.length > 0 && (
          <section className={styles.section}>
            <div className={styles.externalHeader}>
              <h2 className={styles.sectionTitle}>External Articles</h2>
              <p className={styles.externalSubtitle}>Recent articles published on external platforms</p>
            </div>

            <div className={styles.externalGrid}>
              {externalArticles.map((article, idx) => {
                const href = getExternalHref(article);
                if (!href) return null;

                const sourceLabel = normalizeSourceLabel(article.source);
                const dateLabel = formatDateSafe(article.date);

                return (
                  <a
                    key={getExternalKey(article, idx)}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={styles.externalCard}
                  >
                    <div className={styles.externalCardHeader}>
                      <span
                        className={`${styles.platformBadge} ${
                          styles[toPlatformClass(article.source)] || ''
                        }`}
                      >
                        {sourceLabel}
                      </span>

                      {dateLabel && <span className={styles.externalDate}>{dateLabel}</span>}
                    </div>

                    <h3 className={styles.externalTitle}>{article.title || '(Untitled)'}</h3>

                    {article.excerpt && <p className={styles.externalExcerpt}>{article.excerpt}</p>}

                    <div className={styles.externalFooter}>
                      <span className={styles.externalLink}>Read on {sourceLabel} →</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
