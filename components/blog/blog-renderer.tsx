// components/blog/blog-renderer.tsx
import React from 'react';
import { load } from 'cheerio';
import { FadeIn } from './FadeIn';
import { CalloutBox } from './CalloutBox';
import { CodeBlock } from './CodeBlock';
import { InteractiveChecklist } from './InteractiveChecklist';
import { ComparisonCard } from './ComparisonCard';
import { ProgressBar } from './ProgressBar';
import { AccordionItem } from './AccordionItem';
import { ToolTip } from './ToolTip';

interface BlogRendererProps {
  html: string;
}

/**
 * HTMLをReactコンポーネントに変換
 * カスタムタグ（<fade-in>, <callout-box>など）をReactコンポーネントに置換
 */
export function BlogRenderer({ html }: BlogRendererProps) {
  try {
    const $ = load(html, {
      xmlMode: false,
      // decodeEntities は cheerio の型定義に存在しないため指定しない
    });

    // <body>の中身のみ抽出（<html>, <head>を除外）
    const body = $('body');
    const content = body.length > 0 ? body : $.root();

    // Reactコンポーネントに変換
    const reactElements = parseNode(content, $);

    return (
      <div className="blog-content-wrapper">
        {reactElements}
      </div>
    );
  } catch (error) {
    console.error('BlogRenderer: Parse failed, using fallback', error);
    // フォールバック：パース失敗時は従来の方法
    return (
      <div
        className="blog-content-wrapper"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
}

/**
 * Cheerioノードを再帰的にReact要素に変換
 */
function parseNode(node: any, $: any): React.ReactNode[] {
  const children: React.ReactNode[] = [];

  node.contents().each((index: number, element: any) => {
    // テキストノード
    if (element.type === 'text') {
      const text = $(element).text();
      if (text.trim()) {
        children.push(text);
      }
      return;
    }

    // 要素ノード
    if (element.type === 'tag') {
      const tagName = element.name;
      const attrs = element.attribs || {};
      const childNodes = parseNode($(element), $);

      switch (tagName) {
        case 'fade-in':
          children.push(
            <FadeIn key={index} delay={parseFloat(attrs.delay) || 0}>
              {childNodes}
            </FadeIn>
          );
          break;

        case 'callout-box':
          children.push(
            <CalloutBox
              key={index}
              type={(attrs.type as any) || 'info'}
              title={attrs.title}
            >
              {childNodes}
            </CalloutBox>
          );
          break;

        case 'code-block': {
          const codeText = $(element).text();
          children.push(
            <CodeBlock
              key={index}
              language={attrs.language || 'javascript'}
              code={codeText}
            />
          );
          break;
        }

        case 'interactive-checklist':
          children.push(
            <InteractiveChecklist key={index}>
              {childNodes}
            </InteractiveChecklist>
          );
          break;

        case 'comparison-card':
          children.push(
            <ComparisonCard
              key={index}
              title={attrs.title}
              good={attrs.good}
              bad={attrs.bad}
            />
          );
          break;

        case 'progress-bar':
          children.push(
            <ProgressBar
              key={index}
              value={parseInt(attrs.value, 10) || 0}
              max={parseInt(attrs.max, 10) || 100}
              label={attrs.label}
            />
          );
          break;

        case 'accordion-item':
          children.push(
            <AccordionItem key={index} title={attrs.title}>
              {childNodes}
            </AccordionItem>
          );
          break;

        case 'tool-tip':
          children.push(
            <ToolTip
              key={index}
              text={attrs.text}
              position={attrs.position as any}
            >
              {childNodes}
            </ToolTip>
          );
          break;

        // 通常のHTML要素
        default:
          children.push(
            createElement(tagName, attrs, childNodes, index)
          );
      }
    }
  });

  return children;
}

/**
 * 通常のHTML要素を作成
 */
function createElement(
  tagName: string,
  attrs: Record<string, any>,
  children: React.ReactNode[],
  key: number
): React.ReactElement {
  const props: any = { key };

  // 属性を変換
  Object.entries(attrs).forEach(([name, value]) => {
    if (name === 'class') {
      props.className = value;
    } else if (name.startsWith('aria-') || name.startsWith('data-')) {
      props[name] = value;
    } else {
      props[name] = value;
    }
  });

  props.children = children.length > 0 ? children : undefined;

  return React.createElement(tagName, props);
}
