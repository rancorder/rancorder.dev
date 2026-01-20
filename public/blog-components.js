// public/blog-components.js
// Web Components for Interactive Blog Elements

// 1. Callout Box (Info, Warning, Success, Critical)
class CalloutBox extends HTMLElement {
  connectedCallback() {
    const type = this.getAttribute('type') || 'info';
    const title = this.getAttribute('title') || '';
    const content = this.innerHTML;
    
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      success: '✅',
      critical: '🧨'
    };
    
    this.className = `callout callout--${type}`;
    this.innerHTML = `
      <div class="callout__icon" aria-hidden="true">${icons[type]}</div>
      <div class="callout__body">
        ${title ? `<div class="callout__title">${title}</div>` : ''}
        <div class="callout__content">${content}</div>
      </div>
    `;
  }
}

// 2. Fade In Animation
class FadeIn extends HTMLElement {
  connectedCallback() {
    const delay = parseInt(this.getAttribute('delay')) || 0;
    const duration = parseInt(this.getAttribute('duration')) || 600;
    
    this.style.opacity = '0';
    this.style.transform = 'translateY(20px)';
    this.style.transition = `all ${duration}ms ease`;
    
    setTimeout(() => {
      this.style.opacity = '1';
      this.style.transform = 'translateY(0)';
    }, delay);
  }
}

// 3. Interactive Checklist
class InteractiveChecklist extends HTMLElement {
  connectedCallback() {
    const items = Array.from(this.querySelectorAll('li'));
    
    items.forEach(item => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'checklist-checkbox';
      checkbox.setAttribute('aria-label', 'Toggle checklist item');
      
      const wrapper = document.createElement('label');
      wrapper.className = 'checklist-item';
      
      // 元のli内容を取得
      const content = item.innerHTML;
      
      // li内容を置き換え
      item.innerHTML = '';
      wrapper.appendChild(checkbox);
      
      const textSpan = document.createElement('span');
      textSpan.innerHTML = content;
      wrapper.appendChild(textSpan);
      
      item.appendChild(wrapper);
      
      // チェック時の動作
      checkbox.addEventListener('change', () => {
        item.classList.toggle('checked', checkbox.checked);
        textSpan.style.opacity = checkbox.checked ? '0.5' : '1';
        textSpan.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
      });
    });
  }
}

// 4. Code Block with Copy Button
class CodeBlock extends HTMLElement {
  connectedCallback() {
    const language = this.getAttribute('language') || 'javascript';
    const code = this.textContent.trim();
    
    this.className = 'code-block-wrapper';
    this.innerHTML = `
      <div class="code-block-header">
        <span class="code-block-lang">${language}</span>
        <button class="code-block-copy" aria-label="Copy code">
          <span class="copy-icon">📋</span>
          <span class="copy-text">Copy</span>
        </button>
      </div>
      <pre class="code-block"><code class="language-${language}">${this.escapeHtml(code)}</code></pre>
    `;
    
    // コピー機能
    const copyBtn = this.querySelector('.code-block-copy');
    const codeElement = this.querySelector('code');
    
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeElement.textContent);
        copyBtn.querySelector('.copy-text').textContent = 'Copied!';
        copyBtn.querySelector('.copy-icon').textContent = '✅';
        
        setTimeout(() => {
          copyBtn.querySelector('.copy-text').textContent = 'Copy';
          copyBtn.querySelector('.copy-icon').textContent = '📋';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ========================================
// ⭐ UPDATED: Tab Group with Enhanced Styles
// ========================================
class TabGroup extends HTMLElement {
  connectedCallback() {
    const tabButtons = Array.from(this.querySelectorAll('[data-tab-button]'));
    const tabPanels = Array.from(this.querySelectorAll('[data-tab-panel]'));
    
    // ⭐ スタイルを直接適用（SPA遷移対応）
    this.applyButtonStyles(tabButtons);
    
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // すべて非アクティブに
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          this.updateButtonStyle(btn, false);
        });
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // クリックされたタブをアクティブに
        button.classList.add('active');
        tabPanels[index].classList.add('active');
        this.updateButtonStyle(button, true);
      });
    });
    
    // 初期状態: 最初のタブをアクティブ
    if (tabButtons.length > 0 && tabPanels.length > 0) {
      tabButtons[0].classList.add('active');
      tabPanels[0].classList.add('active');
      this.updateButtonStyle(tabButtons[0], true);
    }
  }
  
  // ⭐ ボタンスタイルを直接適用
  applyButtonStyles(buttons) {
    buttons.forEach(button => {
      // 基本スタイルを強制適用
      Object.assign(button.style, {
        boxShadow: '0 2px 4px rgba(96, 165, 250, 0.1), inset 0 -1px 0 rgba(96, 165, 250, 0.2)',
        borderRadius: '6px 6px 0 0',
        background: 'linear-gradient(180deg, rgba(96, 165, 250, 0.03), transparent)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
      });
      
      // ホバーエフェクト
      button.addEventListener('mouseenter', () => {
        if (!button.classList.contains('active')) {
          Object.assign(button.style, {
            boxShadow: '0 4px 12px rgba(96, 165, 250, 0.25), inset 0 -1px 0 rgba(96, 165, 250, 0.3)',
            transform: 'translateY(-2px)',
            background: 'linear-gradient(180deg, rgba(96, 165, 250, 0.1), rgba(96, 165, 250, 0.05))'
          });
        }
      });
      
      button.addEventListener('mouseleave', () => {
        if (!button.classList.contains('active')) {
          Object.assign(button.style, {
            boxShadow: '0 2px 4px rgba(96, 165, 250, 0.1), inset 0 -1px 0 rgba(96, 165, 250, 0.2)',
            transform: '',
            background: 'linear-gradient(180deg, rgba(96, 165, 250, 0.03), transparent)'
          });
        }
      });
      
      // クリックアニメーション
      button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(-1px) scale(0.98)';
      });
      
      button.addEventListener('mouseup', () => {
        if (button.classList.contains('active')) {
          button.style.transform = 'translateY(0)';
        } else {
          button.style.transform = 'translateY(-2px)';
        }
      });
    });
  }
  
  // ⭐ アクティブ状態のスタイル更新
  updateButtonStyle(button, isActive) {
    if (isActive) {
      Object.assign(button.style, {
        boxShadow: '0 6px 20px rgba(96, 165, 250, 0.4), inset 0 1px 3px rgba(96, 165, 250, 0.15)',
        background: 'linear-gradient(180deg, rgba(96, 165, 250, 0.15), rgba(96, 165, 250, 0.08))',
        transform: 'translateY(0)'
      });
    } else {
      Object.assign(button.style, {
        boxShadow: '0 2px 4px rgba(96, 165, 250, 0.1), inset 0 -1px 0 rgba(96, 165, 250, 0.2)',
        background: 'linear-gradient(180deg, rgba(96, 165, 250, 0.03), transparent)',
        transform: ''
      });
    }
  }
}

// 6. Comparison Card
class ComparisonCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const good = this.getAttribute('good') || '';
    const bad = this.getAttribute('bad') || '';
    
    this.className = 'comparison-card';
    this.innerHTML = `
      <div class="comparison-card__title">${title}</div>
      <div class="comparison-grid">
        <div class="comparison-item comparison-item--good">
          <div class="comparison-icon">✅</div>
          <div class="comparison-label">Good</div>
          <div class="comparison-text">${good}</div>
        </div>
        <div class="comparison-item comparison-item--bad">
          <div class="comparison-icon">❌</div>
          <div class="comparison-label">Bad</div>
          <div class="comparison-text">${bad}</div>
        </div>
      </div>
    `;
  }
}

// 7. Progress Bar
class ProgressBar extends HTMLElement {
  connectedCallback() {
    const value = parseInt(this.getAttribute('value')) || 0;
    const max = parseInt(this.getAttribute('max')) || 100;
    const label = this.getAttribute('label') || '';
    
    const percentage = Math.min((value / max) * 100, 100);
    
    this.className = 'progress-bar-wrapper';
    this.innerHTML = `
      ${label ? `<div class="progress-label">${label}</div>` : ''}
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percentage}%">
          <span class="progress-text">${Math.round(percentage)}%</span>
        </div>
      </div>
    `;
  }
}

// 8. Accordion
class AccordionItem extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Click to expand';
    const content = this.innerHTML;
    
    this.className = 'accordion-item';
    this.innerHTML = `
      <button class="accordion-header" aria-expanded="false">
        <span class="accordion-title">${title}</span>
        <span class="accordion-icon">▼</span>
      </button>
      <div class="accordion-content" hidden>
        <div class="accordion-body">${content}</div>
      </div>
    `;
    
    const header = this.querySelector('.accordion-header');
    const content_div = this.querySelector('.accordion-content');
    const icon = this.querySelector('.accordion-icon');
    
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      
      header.setAttribute('aria-expanded', !isExpanded);
      content_div.hidden = isExpanded;
      icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
      this.classList.toggle('expanded', !isExpanded);
    });
  }
}

// 9. Tooltip
class ToolTip extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || 'Tooltip';
    const position = this.getAttribute('position') || 'top';
    const content = this.innerHTML;
    
    this.className = 'tooltip-wrapper';
    this.innerHTML = `
      <span class="tooltip-trigger">${content}</span>
      <span class="tooltip-text tooltip-${position}" role="tooltip">${text}</span>
    `;
  }
}

// カスタム要素を登録
customElements.define('callout-box', CalloutBox);
customElements.define('fade-in', FadeIn);
customElements.define('interactive-checklist', InteractiveChecklist);
customElements.define('code-block', CodeBlock);
customElements.define('tab-group', TabGroup);
customElements.define('comparison-card', ComparisonCard);
customElements.define('progress-bar', ProgressBar);
customElements.define('accordion-item', AccordionItem);
customElements.define('tool-tip', ToolTip);

console.log('✅ Blog Web Components loaded successfully (with enhanced tab styles)');
