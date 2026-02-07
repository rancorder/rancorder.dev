export default function LPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="lp-page">
        {children}
      </body>
    </html>
  );
}
