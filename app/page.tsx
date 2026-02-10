import { redirect } from 'next/navigation';

export default function Home() {
  // トップページ = 日本語ポートフォリオにリダイレクト
  redirect('/portfolio/ja');
}
