// components/blog/blog-renderer.tsx
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
      decodeEntities: true,
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

  node.contents().each((_index: number, element: any) => {
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

      // カスタム要素を React コンポーネントに変換
      switch (tagName) {
        case 'fade-in':
          children.push(
            <FadeIn key={_index} delay={parseFloat(attrs.delay) || 0}>
              {childNodes}
            </FadeIn>
          );
          break;

        case 'callout-box':
          children.push(
            <CalloutBox 
              key={_index}
              type={attrs.type as any || 'info'}
              title={attrs.title}
            >
              {childNodes}
            </CalloutBox>
          );
          break;

        case 'code-block':
          const codeText = $(element).text();
          children.push(
            <CodeBlock 
              key={_index}
              language={attrs.language || 'javascript'}
              code={codeText}
            />
          );
          break;

        case 'interactive-checklist':
          children.push(
            <InteractiveChecklist key={_index}>
              {childNodes}
            </InteractiveChecklist>
          );
          break;

        case 'comparison-card':
          children.push(
            <ComparisonCard
              key={_index}
              title={attrs.title}
              good={attrs.good}
              bad={attrs.bad}
            />
          );
          break;

        case 'progress-bar':
          children.push(
            <ProgressBar
              key={_index}
              value={parseInt(attrs.value) || 0}
              max={parseInt(attrs.max) || 100}
              label={attrs.label}
            />
          );
          break;

        case 'accordion-item':
          children.push(
            <AccordionItem key={_index} title={attrs.title}>
              {childNodes}
            </AccordionItem>
          );
          break;

        case 'tool-tip':
          children.push(
            <ToolTip 
              key={_index}
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
            createElement(tagName, attrs, childNodes, _index)
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
    // classをclassNameに変換
    if (name === 'class') {
      props.className = value;
    } 
    // style属性をオブジェクトに変換
    else if (name === 'style' && typeof value === 'string') {
      props.style = parseStyleString(value);
    }
    // aria-*, data-* はそのまま
    else if (name.startsWith('aria-') || name.startsWith('data-')) {
      props[name] = value;
    }
    // その他の属性
    else {
      props[name] = value;
    }
  });

  // 子要素
  props.children = children.length > 0 ? children : undefined;

  // React.createElement を使って要素を作成
  return require('react').createElement(tagName, props);
}

/**
 * CSS文字列をReactスタイルオブジェクトに変換
 * 例: "color: red; font-size: 14px" → {color: 'red', fontSize: '14px'}
 */
function parseStyleString(styleStr: string): Record<string, string> {
  const style: Record<string, string> = {};
  
  styleStr.split(';').forEach(rule => {
    const colonIndex = rule.indexOf(':');
    if (colonIndex === -1) return;
    
    const property = rule.substring(0, colonIndex).trim();
    const value = rule.substring(colonIndex + 1).trim();
    
    if (!property || !value) return;
    
    // CSS property を camelCase に変換
    // 例: font-size → fontSize, background-color → backgroundColor
    const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    
    style[camelProperty] = value;
  });
  
  return style;
}
