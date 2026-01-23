'use client';

import styles from './ShareButtons.module.css';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnHatena = () => {
    const hatenaUrl = `https://b.hatena.ne.jp/entry/${encodeURIComponent(url)}`;
    window.open(hatenaUrl, '_blank', 'noopener,noreferrer');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URLをコピーしました！');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={styles.shareButtons}>
      <button
        onClick={shareOnTwitter}
        className={`${styles.shareButton} ${styles.twitter}`}
        aria-label="Share on Twitter"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
        <span>Twitter</span>
      </button>

      <button
        onClick={shareOnHatena}
        className={`${styles.shareButton} ${styles.hatena}`}
        aria-label="Share on Hatena Bookmark"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9.77 17.78H7.04V7.5h2.73v10.28zm7.94-3.82c0 1.82-1.47 3.27-3.3 3.27h-2.86v-2.14h2.86c.62 0 1.12-.5 1.12-1.13 0-.62-.5-1.12-1.12-1.12h-2.86V7.5h2.86c1.83 0 3.3 1.47 3.3 3.27v3.19z" />
        </svg>
        <span>はてブ</span>
      </button>

      <button
        onClick={copyToClipboard}
        className={`${styles.shareButton} ${styles.copy}`}
        aria-label="Copy URL"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2" />
        </svg>
        <span>Copy</span>
      </button>
    </div>
  );
}
