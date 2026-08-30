import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/health-os'],
      },
    ],
    host: 'https://rancorder.dev',
    sitemap: 'https://rancorder.dev/sitemap.xml',
  };
}
