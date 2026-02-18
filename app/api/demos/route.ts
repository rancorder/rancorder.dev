// app/api/demos/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

interface DemoMetadata {
  title: string;
  desc: string;
  tech: string;
  demo: string;
  type: 'demo' | 'play';
  level: number;
  color: string;
}

// HTMLからメタデータを抽出
function extractMetadata(htmlContent: string, filename: string): Partial<DemoMetadata> {
  const metaRegex = /<!--\s*DEMO_META\s*([\s\S]*?)\s*-->/;
  const match = htmlContent.match(metaRegex);
  
  if (match) {
    const metaContent = match[1];
    const meta: any = {};
    
    metaContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        const value = valueParts.join(':').trim();
        meta[key.trim()] = value;
      }
    });
    
    return {
      title: meta.title,
      desc: meta.desc,
      tech: meta.tech,
      level: meta.level ? parseInt(meta.level) : undefined,
      color: meta.color,
      type: meta.type === 'play' ? 'play' : 'demo',
    };
  }
  
  return {};
}

// ファイル名からタイトル生成
function generateTitle(filename: string): string {
  return filename
    .replace('.html', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// デフォルト値
const defaultColors = ['#ff6b35', '#00d9ff', '#a855f7', '#06b6d4', '#10b981', '#f59e0b'];

export async function GET() {
  try {
    const demosDir = path.join(process.cwd(), 'public/demos');
    
    if (!fs.existsSync(demosDir)) {
      return NextResponse.json({ demos: [] });
    }
    
    const files = fs.readdirSync(demosDir).filter(f => f.endsWith('.html'));
    
    const demos: DemoMetadata[] = files.map((file, index) => {
      const filePath = path.join(demosDir, file);
      const htmlContent = fs.readFileSync(filePath, 'utf-8');
      const extracted = extractMetadata(htmlContent, file);
      
      return {
        title: extracted.title || generateTitle(file),
        desc: extracted.desc || 'Interactive Canvas Demo',
        tech: extracted.tech || 'JavaScript · Canvas 2D',
        demo: `/demos/${file}`,
        type: extracted.type || 'demo',
        level: extracted.level || 85 + Math.floor(Math.random() * 10),
        color: extracted.color || defaultColors[index % defaultColors.length],
      };
    });
    
    return NextResponse.json({ demos });
  } catch (error) {
    console.error('Error loading demos:', error);
    return NextResponse.json({ demos: [] }, { status: 500 });
  }
}
