export default function TableOfContents({ toc }) {
  return (
    <nav>
      {toc.map(item => (
        <a key={item.id} href={`#${item.id}`}>
          {item.text}
        </a>
      ))}
    </nav>
  );
}
