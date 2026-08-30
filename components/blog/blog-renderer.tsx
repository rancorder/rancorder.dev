// components/blog/blog-renderer.tsx
import parse, { domToReact, Element, Text, type DOMNode, type HTMLReactParserOptions } from 'html-react-parser';
import { AccordionItem } from './AccordionItem';
import { CalloutBox } from './CalloutBox';
import { CodeBlock } from './CodeBlock';
import { ComparisonCard } from './ComparisonCard';
import { FadeIn } from './FadeIn';
import { InteractiveChecklist } from './InteractiveChecklist';
import { ProgressBar } from './ProgressBar';

export type BlogRendererProps = {
  content: string;
};

function textContent(nodes: DOMNode[]): string {
  return nodes
    .map((node) => {
      if (node instanceof Text) return node.data;
      if (node instanceof Element) return textContent(node.children as DOMNode[]);
      return '';
    })
    .join('');
}

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function checklistNodes(element: Element): DOMNode[] {
  const list = element.children.find(
    (child) => child instanceof Element && (child.name === 'ul' || child.name === 'ol')
  );
  return list instanceof Element ? (list.children as DOMNode[]) : (element.children as DOMNode[]);
}

function checklistFromAttribute(value?: string) {
  if (!value) return null;
  try {
    const items: unknown = JSON.parse(value);
    if (!Array.isArray(items)) return null;
    return items
      .filter((item): item is string => typeof item === 'string')
      .map((item) => <li key={item}>{item}</li>);
  } catch {
    return null;
  }
}

export function BlogRenderer({ content }: BlogRendererProps) {
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element)) return;

      const children = () => domToReact(node.children as DOMNode[], options);
      const attributes = node.attribs;

      switch (node.name) {
        case 'script':
          return <></>;
        case 'fade-in': {
          const delay = parseNumber(attributes.delay, 0);
          return (
            <FadeIn
              delay={delay > 10 ? delay / 1000 : delay}
              duration={parseNumber(attributes.duration, 700)}
            >
              {children()}
            </FadeIn>
          );
        }
        case 'callout-box': {
          const allowedTypes = ['info', 'warning', 'success', 'critical'] as const;
          const type = allowedTypes.find((candidate) => candidate === attributes.type) ?? 'info';
          return (
            <CalloutBox type={type} title={attributes.title}>
              {children()}
            </CalloutBox>
          );
        }
        case 'code-block':
          return (
            <CodeBlock
              language={attributes.language}
              title={attributes.title}
              code={textContent(node.children as DOMNode[]).trim()}
            />
          );
        case 'interactive-checklist':
          return (
            <InteractiveChecklist>
              {checklistFromAttribute(attributes.items) ?? domToReact(checklistNodes(node), options)}
            </InteractiveChecklist>
          );
        case 'comparison-card':
          return (
            <ComparisonCard
              title={attributes.title}
              good={attributes.good ?? attributes.after ?? ''}
              bad={attributes.bad ?? attributes.before ?? ''}
            />
          );
        case 'progress-bar':
          return (
            <ProgressBar
              value={parseNumber(attributes.value, 0)}
              max={parseNumber(attributes.max, 100)}
              label={attributes.label}
            />
          );
        case 'accordion-item':
          return <AccordionItem title={attributes.title ?? '詳細'}>{children()}</AccordionItem>;
        default:
          return;
      }
    },
  };

  return <>{parse(content, options)}</>;
}
