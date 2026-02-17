// components/blog/CodeBlock.tsx
'use client';

import { useState } from 'react';

interface CodeBlockProps {
  language?: string;
  code: string;
}

/**
 * コードブロックコンポーネント
 * コピー機能付き
 */
export function CodeBlock({ language = 'javascript', code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
        <button 
          className="code-block-copy" 
          onClick={handleCopy}
          aria-label="Copy code"
        >
          <span className="copy-icon">{copied ? '✅' : '📋'}</span>
          <span className="copy-text">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="code-block">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
