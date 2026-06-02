import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ola.olalab.kr';
  
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
      crawlDelay: 10,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
