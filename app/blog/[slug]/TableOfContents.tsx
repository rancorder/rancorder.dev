type TocItem = {
  id: string;
  text: string;
  level: number;
};

export default function TableOfContents({ toc }: { toc: TocItem[] }) {
  return (
    <nav>
      {toc.map((item) => (
        <a key={item.id} href={`#${item.id}`}>
          {item.text}
        </a>
      ))}
    </nav>
  );
}
