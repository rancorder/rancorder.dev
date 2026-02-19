import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface DemoMeta {
  id: string;
  title: string;
  desc: string;
  tech: string;
  level: number;
  color: string;
  type: string;
  filename: string;
  demoUrl: string;
}

export async function GET() {
  try {
    const demosDir = path.join(process.cwd(), 'public', 'demos');
    
    // Check if directory exists
    if (!fs.existsSync(demosDir)) {
      return NextResponse.json({ demos: [] });
    }
    
    const files = fs.readdirSync(demosDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    const demos: DemoMeta[] = [];
    
    for (const file of htmlFiles) {
      const filePath = path.join(demosDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract DEMO_META comment
      const metaMatch = content.match(/<!--\s*DEMO_META\s*([\s\S]*?)-->/);
      
      if (metaMatch) {
        const metaContent = metaMatch[1];
        
        // Parse meta fields
        const title = metaContent.match(/title:\s*(.+)/)?.[1]?.trim() || 'Unknown';
        const desc = metaContent.match(/desc:\s*(.+)/)?.[1]?.trim() || '';
        const tech = metaContent.match(/tech:\s*(.+)/)?.[1]?.trim() || '';
        const levelStr = metaContent.match(/level:\s*(\d+)/)?.[1];
        const level = levelStr ? parseInt(levelStr, 10) : 5;
        const color = metaContent.match(/color:\s*(#[0-9a-fA-F]{6})/)?.[1] || '#a855f7';
        const type = metaContent.match(/type:\s*(\w+)/)?.[1]?.trim() || 'demo';
        
        demos.push({
          id: file.replace('.html', ''),
          title,
          desc,
          tech,
          level,
          color,
          type,
          filename: file,
          demoUrl: `/demos/${file}`
        });
      }
    }
    
    return NextResponse.json({ demos });
  } catch (error) {
    console.error('Error reading demos:', error);
    return NextResponse.json({ demos: [] });
  }
}
