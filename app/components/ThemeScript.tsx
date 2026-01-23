// app/components/ThemeScript.tsx
// ページロード時のちらつきを防ぐスクリプト

export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {
              console.error('Theme initialization failed:', e);
            }
          })();
        `,
      }}
    />
  );
}
