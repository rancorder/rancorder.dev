import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIRECTORY = path.join(process.cwd(), 'content', 'blog');
const SAFE_SLUG = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;

export type BlogMetadata = {
  title: string;
  date: string;
  category?: string;
  excerpt?: string;
  readingTime?: string;
  tags: string[];
};

export type BlogPost = BlogMetadata & {
  slug: string;
  content: string;
};

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function parseTags(value?: string): string[] {
  if (!value) return [];

  const normalized = value.trim();
  if (normalized.startsWith('[') && normalized.endsWith(']')) {
    try {
      const parsed: unknown = JSON.parse(normalized);
      if (Array.isArray(parsed)) {
        return parsed.filter((tag): tag is string => typeof tag === 'string');
      }
    } catch {
      // Fall through to the comma-separated form.
    }
  }

  return normalized
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function parseFrontmatter(html: string): Record<string, string> {
  const comment = html.match(/<!--([\s\S]*?)-->/)?.[1];
  if (!comment) return {};

  return Object.fromEntries(
    comment
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map((match) => [match[1], match[2]])
  );
}

function extractMetadata(html: string, slug: string): BlogMetadata {
  const frontmatter = parseFrontmatter(html);
  const title =
    frontmatter.title ??
    (stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '') || 'Untitled');
  const date =
    frontmatter.date ??
    html.match(/<time[^>]*datetime=["']([^"']+)["']/i)?.[1] ??
    slug.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ??
    '1970-01-01';
  const excerpt =
    frontmatter.excerpt ??
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    stripTags(html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? '');
  const keywordTags = html.match(
    /<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']+)["']/i
  )?.[1];

  return {
    title,
    date,
    category: frontmatter.category,
    excerpt: excerpt || undefined,
    readingTime:
      frontmatter.readingTime ??
      frontmatter['reading-time'] ??
      html.match(/<meta[^>]+name=["']reading-time["'][^>]+content=["']([^"']+)["']/i)?.[1],
    tags: parseTags(frontmatter.tags ?? keywordTags),
  };
}

function extractContent(html: string): string {
  const styles = Array.from(html.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/gi), (match) => match[0]);
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;

  const content = body
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!doctype[^>]*>/gi, '')
    .replace(/<\/?(?:html|head|body)\b[^>]*>/gi, '')
    .replace(/<(?:title|meta|link)\b[^>]*>[\s\S]*?<\/(?:title|meta|link)>/gi, '')
    .replace(/<(?:meta|link)\b[^>]*\/?\s*>/gi, '')
    .trim();

  return [...styles, content].filter(Boolean).join('\n');
}

function listBlogFiles(): string[] {
  if (!fs.existsSync(BLOG_DIRECTORY)) return [];

  return fs
    .readdirSync(BLOG_DIRECTORY, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html') && !entry.name.startsWith('_'))
    .map((entry) => entry.name);
}

export function getBlogPost(slug: string): BlogPost | null {
  if (!SAFE_SLUG.test(slug)) return null;

  const filePath = path.join(BLOG_DIRECTORY, `${slug}.html`);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return null;

  const html = fs.readFileSync(filePath, 'utf8');
  return {
    slug,
    ...extractMetadata(html, slug),
    content: extractContent(html),
  };
}

export function getAllBlogPosts(): BlogPost[] {
  return listBlogFiles()
    .map((filename) => getBlogPost(filename.replace(/\.html$/, '')))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogSlugs(): string[] {
  return listBlogFiles().map((filename) => filename.replace(/\.html$/, ''));
}
