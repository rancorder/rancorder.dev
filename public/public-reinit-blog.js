// public/reinit-blog.js
// Next.jsのページ遷移後に自動で再初期化

(function() {
  let lastPath = window.location.pathname;
  
  // URLの変更を監視
  function checkPathChange() {
    const currentPath = window.location.pathname;
    
    if (currentPath !== lastPath) {
      console.log('🔄 Path changed:', lastPath, '→', currentPath);
      lastPath = currentPath;
      
      // ブログ記事ページなら再初期化
      if (currentPath.startsWith('/blog/')) {
        setTimeout(() => {
          if (typeof window.reinitBlogArticle === 'function') {
            window.reinitBlogArticle();
          }
        }, 200);
      }
    }
    
    requestAnimationFrame(checkPathChange);
  }
  
  checkPathChange();
})();
