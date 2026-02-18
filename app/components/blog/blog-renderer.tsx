// components/blog/blog-renderer.tsx
// Server Component - HTML文字列をReact Element Treeに変換

import { load } from 'cheerio';
import React from 'react';
import {
  FadeIn,
  CalloutBox,
  CodeBlock,
  InteractiveChecklist,
  ComparisonCard,
  ProgressBar,
  AccordionItem,
  ToolTip,
  GlitchText,
  QuizBlock,
  Typewriter,
  CounterUp,
  TimelineItem,
} from './index';

// Props定義 - Server Component → Client Component 制約準拠
export interface BlogRendererProps {
  content: string;  // HTMLコンテンツ文字列（JSONシリアライズ可能）
}

// カスタムタグとReactコンポーネントのマッピング
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  'fade-in': FadeIn,
  'callout-box': CalloutBox,
  'code-block': CodeBlock,
  'interactive-checklist': InteractiveChecklist,
  'comparison-card': ComparisonCard,
  'progress-bar': ProgressBar,
  'accordion-item': AccordionItem,
  'tool-tip': ToolTip,
  'glitch-text': GlitchText,
  'quiz-block': QuizBlock,
  'typewriter': Typewriter,
  'counter-up': CounterUp,
  'timeline-item': TimelineItem,
};

// 属性値の型変換（文字列 → 適切な型）
function parseAttrValue(key: string, value: string): any {
  // 数値型のprops
  if (['delay', 'duration', 'value', 'max', 'target', 'speed'].includes(key)) {
    const num = Number(value);
    return isNaN(num) ? value : num;
  }
  // 配列型のprops（JSON文字列）
  if (['items', 'options'].includes(key)) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  // ブール型のprops
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  return value;
}

// cheerioノードをReact Elementに変換（再帰）
function nodeToReact(node: any, index: number): React.ReactNode {
  // テキストノード
  if (node.type === 'text') {
    return node.data;
  }

  // 要素ノード
  if (node.type === 'tag') {
    const tagName = node.name;
    const attrs: Record<string, any> = {};
    const children: React.ReactNode[] = [];

    // 属性を変換
    if (node.attribs) {
      Object.entries(node.attribs).forEach(([key, value]) => {
        attrs[key] = parseAttrValue(key, value as string);
      });
    }

    // 子要素を再帰的に変換
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any, i: number) => {
        const childNode = nodeToReact(child, i);
        if (childNode !== null && childNode !== undefined) {
          children.push(childNode);
        }
      });
    }

    // カスタムタグの場合、対応するReactコンポーネントを返す
    if (COMPONENT_MAP[tagName]) {
      const Component = COMPONENT_MAP[tagName];
      return <Component key={index} {...attrs}>{children}</Component>;
    }

    // 通常のHTMLタグの場合、React.createElementで生成
    return React.createElement(
      tagName,
      { key: index, ...attrs },
      children.length > 0 ? children : null
    );
  }

  return null;
}

// メインコンポーネント
export function BlogRenderer({ content }: BlogRendererProps) {
  try {
    // cheerioでHTMLをパース
    const $ = load(content);
    const bodyChildren = $('body').children().toArray();

    // 各子要素をReact Elementに変換
    const elements = bodyChildren.map((node, index) => nodeToReact(node, index));

    return <>{elements}</>;
  } catch (error) {
    // パース失敗時のフォールバック
    console.error('BlogRenderer parse error:', error);
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ color: 'rgba(255,255,255,0.7)' }}
      />
    );
  }
}
