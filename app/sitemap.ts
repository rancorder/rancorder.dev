import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rancorder.dev';
  
  // デモファイルを自動検出
  const demosDir = path.join(process.cwd(), 'public/demos');
  let demos: MetadataRoute.Sitemap = [];
  
  if (fs.existsSync(demosDir)) {
    const demoFiles = fs.readdirSync(demosDir).filter(f => f.endsWith('.html'));
    
    demos = demoFiles.map(file => ({
      url: `${baseUrl}/demos/${file}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...demos,
  ];
}
