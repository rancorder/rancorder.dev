// ============================================
// Extended Blog Components v1.0
// rancorder.dev 追加コンポーネント
// ============================================

// ============================================
// 10. YES/NO Question - 単一質問版（Tier 2）
// ============================================
class YesNoQuestion extends HTMLElement {
  connectedCallback() {
    // 既に初期化済みならスキップ（重複初期化を防ぐ）
    if (this.hasAttribute('data-initialized')) {
      return;
    }
    
    const question = this.getAttribute('question') || 'Yes or No?';
    const yesSlot = this.querySelector('[slot="yes"]');
    const noSlot = this.querySelector('[slot="no"]');
    
    if (!yesSlot || !noSlot) {
      console.error('YesNoQuestion: [slot="yes"] and [slot="no"] are required');
      return;
    }
    
    const yesContent = yesSlot.innerHTML;
    const noContent = noSlot.innerHTML;
    
    this.className = 'yes-no-question';
    this.innerHTML = `
      <div class="question-container">
        <div class="question-text">${question}</div>
        <div class="question-buttons">
          <button type="button" class="btn-yes" aria-label="Yes">👍 Yes</button>
          <button type="button" class="btn-no" aria-label="No">👎 No</button>
        </div>
        <div class="question-result" hidden></div>
      </div>
    `;
    
    const btnYes = this.querySelector('.btn-yes');
    const btnNo = this.querySelector('.btn-no');
    const result = this.querySelector('.question-result');
    const buttons = this.querySelector('.question-buttons');
    
    btnYes.addEventListener('click', () => {
      result.innerHTML = yesContent;
      result.hidden = false;
      buttons.hidden = true;
      this.setAttribute('data-answer', 'yes');
    });
    
    btnNo.addEventListener('click', () => {
      result.innerHTML = noContent;
      result.hidden = false;
      buttons.hidden = true;
      this.setAttribute('data-answer', 'no');
    });
    
    // 初期化済みフラグを設定
    this.setAttribute('data-initialized', 'true');
  }
}

// ============================================
// 11. Delayed Reveal - ボタンクリックで遅延表示（Tier 2）
// ============================================
class DelayedReveal extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-initialized')) {
      return;
    }
    
    const triggerText = this.getAttribute('trigger-text') || 'Show Content';
    const delay = parseInt(this.getAttribute('delay')) || 2000;
    const content = this.innerHTML;
    
    this.className = 'delayed-reveal';
    this.innerHTML = `
      <button type="button" class="reveal-trigger">${triggerText}</button>
      <div class="reveal-content" hidden>
        <div class="reveal-loading">
          <span class="loading-spinner">⏳</span>
          <span class="loading-text">Loading...</span>
        </div>
        <div class="reveal-body" hidden>${content}</div>
      </div>
    `;
    
    const trigger = this.querySelector('.reveal-trigger');
    const revealContent = this.querySelector('.reveal-content');
    const loading = this.querySelector('.reveal-loading');
    const body = this.querySelector('.reveal-body');
    
    trigger.addEventListener('click', () => {
      trigger.hidden = true;
      revealContent.hidden = false;
      
      setTimeout(() => {
        loading.hidden = true;
        body.hidden = false;
      }, delay);
    });
    
    this.setAttribute('data-initialized', 'true');
  }
}

// ============================================
// 12. Multi-Step Question Flow - 5段階質問（Tier 2）
// ============================================
class QuestionFlow extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-initialized')) {
      return;
    }
    
    const steps = Array.from(this.querySelectorAll('[data-question-step]'));
    let currentStep = 0;
    let answers = [];
    
    if (steps.length === 0) {
      this.innerHTML = '<p>Error: [data-question-step] が見つかりません</p>';
      return;
    }
    
    this.className = 'question-flow';
    
    // 初期化：すべてのステップを非表示
    steps.forEach((step, index) => {
      step.style.display = index === 0 ? 'block' : 'none';
      step.classList.add('question-step');
      
      const question = step.getAttribute('data-question-step');
      const originalContent = step.innerHTML;
      
      step.innerHTML = `
        <div class="step-header">
          <div class="step-number">質問 ${index + 1} / ${steps.length}</div>
          <div class="step-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${((index + 1) / steps.length) * 100}%"></div>
            </div>
          </div>
        </div>
        <div class="step-question">${question}</div>
        <div class="step-content">${originalContent}</div>
        <div class="step-buttons">
          <button type="button" class="step-btn step-yes">👍 Yes</button>
          <button type="button" class="step-btn step-no">👎 No</button>
        </div>
      `;
      
      const yesBtn = step.querySelector('.step-yes');
      const noBtn = step.querySelector('.step-no');
      
      const handleAnswer = (answer) => {
        answers[index] = answer;
        
        if (index < steps.length - 1) {
          // 次のステップへ
          step.style.display = 'none';
          steps[index + 1].style.display = 'block';
          currentStep = index + 1;
        } else {
          // 最終ステップ → 結果表示
          showResults();
        }
      };
      
      yesBtn.addEventListener('click', () => handleAnswer('yes'));
      noBtn.addEventListener('click', () => handleAnswer('no'));
    });
    
    const showResults = () => {
      const yesCount = answers.filter(a => a === 'yes').length;
      const noCount = answers.filter(a => a === 'no').length;
      const percentage = Math.round((yesCount / answers.length) * 100);
      
      this.innerHTML = `
        <div class="flow-result">
          <h3>診断結果</h3>
          <div class="result-stats">
            <div class="stat-item">
              <div class="stat-label">Yes</div>
              <div class="stat-value">${yesCount}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">No</div>
              <div class="stat-value">${noCount}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">一致率</div>
              <div class="stat-value">${percentage}%</div>
            </div>
          </div>
          <div class="result-content">
            ${percentage >= 70 
              ? '<p><strong>✅ 高い一致度</strong><br>あなたは前向きで積極的なタイプです！</p>' 
              : percentage >= 40
              ? '<p><strong>⚖️ バランス型</strong><br>状況に応じて柔軟に判断できるタイプです。</p>'
              : '<p><strong>🤔 慎重派</strong><br>リスクを避け、慎重に判断するタイプです。</p>'}
          </div>
          <button type="button" class="restart-btn">もう一度診断する</button>
        </div>
      `;
      
      const restartBtn = this.querySelector('.restart-btn');
      restartBtn.addEventListener('click', () => {
        answers = [];
        currentStep = 0;
        this.connectedCallback(); // 再初期化
      });
    };
    
    this.setAttribute('data-initialized', 'true');
  }
}

// ============================================
// 13. Scroll Reveal - スクロールで表示（Tier 2）
// ============================================
class ScrollReveal extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-initialized')) {
      return;
    }
    
    const threshold = parseFloat(this.getAttribute('threshold')) || 0.2;
    const delay = parseInt(this.getAttribute('delay')) || 0;
    
    this.style.opacity = '0';
    this.style.transform = 'translateY(30px)';
    this.style.transition = `all 600ms ease ${delay}ms`;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.style.opacity = '1';
            this.style.transform = 'translateY(0)';
          }, delay);
          observer.unobserve(this);
        }
      });
    }, { threshold });
    
    observer.observe(this);
    this.setAttribute('data-initialized', 'true');
  }
}

// ============================================
// 14. Show Once - 初回のみ表示（Tier 3 - localStorage）
// ============================================
class ShowOnce extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-initialized')) {
      return;
    }
    
    const id = this.getAttribute('id');
    
    if (!id) {
      console.error('ShowOnce: id attribute is required');
      this.innerHTML = '<p>Error: id が必要です</p>';
      return;
    }
    
    const storageKey = 'show-once-' + id;
    const content = this.innerHTML;
    
    // localStorage チェック（Tier 3）
    try {
      const hasShown = localStorage.getItem(storageKey);
      
      if (hasShown) {
        // 既に表示済み → 非表示
        this.hidden = true;
        return;
      }
      
      // 初回表示
      this.className = 'show-once';
      this.innerHTML = `
        <div class="show-once-container">
          <button type="button" class="show-once-close" aria-label="Close">×</button>
          <div class="show-once-content">${content}</div>
        </div>
      `;
      
      const closeBtn = this.querySelector('.show-once-close');
      closeBtn.addEventListener('click', () => {
        localStorage.setItem(storageKey, 'true');
        this.style.transition = 'all 0.3s ease';
        this.style.opacity = '0';
        this.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          this.hidden = true;
        }, 300);
      });
      
      this.setAttribute('data-initialized', 'true');
      
    } catch (error) {
      // localStorage が使えない環境 → 警告表示
      console.warn('ShowOnce: localStorage not available', error);
      this.innerHTML = `
        <div style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 2px solid #ef4444; border-radius: 8px; color: #fca5a5;">
          <strong>⚠️ この機能は利用できません</strong><br>
          お使いのブラウザ設定により、localStorage が無効化されています。
        </div>
      `;
    }
  }
}

// ============================================
// カスタム要素を登録
// ============================================
customElements.define('yes-no-question', YesNoQuestion);
customElements.define('delayed-reveal', DelayedReveal);
customElements.define('question-flow', QuestionFlow);
customElements.define('scroll-reveal', ScrollReveal);
customElements.define('show-once', ShowOnce); // Tier 3

// ============================================
// グローバル再初期化関数（クライアント遷移対応）
// ============================================
window.reinitBlogArticle = function() {
  console.log('🔄 Reinitializing all custom elements...');
  
  // すべてのカスタム要素を再初期化
  const elements = [
    'yes-no-question',
    'delayed-reveal',
    'question-flow',
    'scroll-reveal',
    'show-once'
  ];
  
  elements.forEach(tagName => {
    const instances = document.querySelectorAll(tagName);
    instances.forEach(element => {
      // 初期化済みフラグを削除して再初期化を許可
      element.removeAttribute('data-initialized');
      element.removeAttribute('data-answer');
      
      // connectedCallback を再実行
      if (element.connectedCallback) {
        element.connectedCallback();
      }
    });
  });
  
  console.log('✅ Reinitialization complete');
};

console.log('✅ Extended components loaded:');
console.log('  - yes-no-question (Tier 2)');
console.log('  - delayed-reveal (Tier 2)');
console.log('  - question-flow (Tier 2)');
console.log('  - scroll-reveal (Tier 2)');
console.log('  - show-once (Tier 3 - localStorage)');
console.log('  - window.reinitBlogArticle() available');
