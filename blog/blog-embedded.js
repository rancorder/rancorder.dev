// ========================================
// 記事データ（直接埋め込み）
// ========================================
const POSTS_DATA = [
  {
    "title": "Web Componentsの完全ガイド",
    "date": "2024-01-20",
    "file": "2024-01-20-web-components-guide.html",
    "excerpt": "Web Componentsの基礎から実践まで完全解説。カスタム要素、Shadow DOM、テンプレートの使い方を詳しく紹介します。"
  }
];

// ========================================
// 記事一覧の自動生成
// ========================================
if (document.getElementById('posts')) {
  const container = document.getElementById('posts');
  
  if (POSTS_DATA.length === 0) {
    container.innerHTML = '<p class="loading">まだ記事がありません</p>';
  } else {
    container.innerHTML = POSTS_DATA.map((post, i) => `
      <article class="post-preview fade-in" style="animation-delay: ${i * 0.1}s">
        <h2><a href="posts/${post.file}">${post.title}</a></h2>
        <time>${post.date}</time>
        <p>${post.excerpt}</p>
      </article>
    `).join('');
  }
}

// ========================================
// DOMContentLoaded後に初期化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // タブグループを初期化
  document.querySelectorAll('.tab-group').forEach(initTabGroup);
  
  // アコーディオンを初期化
  document.querySelectorAll('.accordion').forEach(initAccordion);
  
  // コードブロックにコピーボタンを追加
  document.querySelectorAll('.code-block').forEach(initCodeBlock);
  
  // スクロールでフェードインを初期化
  initScrollFadeIn();
});

// ========================================
// タブ機能
// ========================================
function initTabGroup(tabGroup) {
  const buttons = tabGroup.querySelectorAll('.tab-button');
  const panels = tabGroup.querySelectorAll('.tab-panel');
  
  if (buttons.length === 0 || panels.length === 0) return;
  
  buttons.forEach((btn, index) => {
    // クリックイベント
    btn.addEventListener('click', () => {
      // すべて非アクティブ
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      // クリックされたものをアクティブに
      btn.classList.add('active');
      if (panels[index]) {
        panels[index].classList.add('active');
      }
    });
    
    // ホバーエフェクト
    btn.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(96, 165, 250, 0.5)';
      }
    });
    
    btn.addEventListener('mouseleave', function() {
      if (!this.classList.contains('active')) {
        this.style.transform = '';
        this.style.boxShadow = '';
      }
    });
  });
  
  // 最初のタブをアクティブに
  if (buttons[0]) {
    buttons[0].click();
  }
}

// ========================================
// アコーディオン機能
// ========================================
function initAccordion(accordion) {
  const header = accordion.querySelector('.accordion-header');
  const content = accordion.querySelector('.accordion-content');
  const icon = accordion.querySelector('.accordion-icon');
  
  if (!header || !content) return;
  
  header.addEventListener('click', () => {
    const isOpen = accordion.classList.contains('open');
    
    // 開閉トグル
    accordion.classList.toggle('open');
    
    // 高さアニメーション
    if (isOpen) {
      content.style.maxHeight = '0';
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
    
    // アイコン回転
    if (icon) {
      icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
    }
  });
}

// ========================================
// コードブロックのコピー機能
// ========================================
function initCodeBlock(block) {
  const code = block.querySelector('code');
  if (!code) return;
  
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.textContent = 'Copy';
  
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied!';
      button.style.background = 'rgba(16, 185, 129, 0.3)';
      button.style.borderColor = '#10b981';
      button.style.color = '#10b981';
      
      setTimeout(() => {
        button.textContent = 'Copy';
        button.style.background = '';
        button.style.borderColor = '';
        button.style.color = '';
      }, 2000);
    } catch (err) {
      console.error('コピー失敗:', err);
      button.textContent = 'Error';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    }
  });
  
  block.appendChild(button);
}

// ========================================
// スクロールでフェードイン
// ========================================
function initScrollFadeIn() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 一度表示したら監視を解除（パフォーマンス向上）
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // .fade-in-scrollクラスの要素を監視
  document.querySelectorAll('.fade-in-scroll').forEach(el => {
    observer.observe(el);
  });
}

console.log('✅ Blog JavaScript loaded successfully');
