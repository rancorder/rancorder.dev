// components/blog/blog-renderer.tsx
"use client";

export type BlogRendererProps = {
  content: string;
};

export function BlogRenderer({ content }: BlogRendererProps) {
  return (
    <article 
      className="prose prose-invert prose-cyan max-w-none
        prose-headings:font-mono prose-headings:text-white
        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-cyan-100/80 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300
        prose-strong:text-white prose-strong:font-bold
        prose-code:text-cyan-300 prose-code:bg-cyan-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-black/60 prose-pre:border prose-pre:border-cyan-500/20
        prose-blockquote:border-l-4 prose-blockquote:border-cyan-500/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-cyan-100/70
        prose-ul:text-cyan-100/80 prose-ol:text-cyan-100/80
        prose-li:my-2
        prose-img:rounded prose-img:border prose-img:border-cyan-500/20"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}
