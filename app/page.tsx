/**
 * app/page.tsx — トップページ（Server Component）
 *
 * - `getLatestPosts` を使って最新5記事をサーバー側で取得
 * - インタラクティブな UI は HomeInteractive (Client Component) に委譲
 */
import { getLatestPosts } from '@/lib/blog';
import HomeInteractive from '@/components/HomeInteractive';

export default function Home() {
  const latestPosts = getLatestPosts(5);

  return <HomeInteractive latestPosts={latestPosts} />;
}
