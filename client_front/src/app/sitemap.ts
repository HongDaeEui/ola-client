import { MetadataRoute } from 'next';
import { API_BASE, apiFetch } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ola.olalab.kr';
const SITEMAP_REVALIDATE_SECONDS = 21600; // 6h
const SITEMAP_ITEM_LIMIT = 200;

export const revalidate = SITEMAP_REVALIDATE_SECONDS;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/ko/tools`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/ko/labs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/ko/community`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/ko/prompts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  try {
    const [postsRes, promptsRes] = await Promise.all([
      apiFetch(`${API_BASE}/posts?limit=${SITEMAP_ITEM_LIMIT}`, { next: { revalidate: SITEMAP_REVALIDATE_SECONDS } }),
      apiFetch(`${API_BASE}/prompts?limit=${SITEMAP_ITEM_LIMIT}`, { next: { revalidate: SITEMAP_REVALIDATE_SECONDS } }),
    ]);

    if (postsRes.ok) {
      const posts = await postsRes.json();
      const postsData = posts.data || posts;
      if (Array.isArray(postsData)) {
        postsData.forEach((post: any) => {
          sitemap.push({
            url: `${SITE_URL}/ko/community/${post.id}`,
            lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    }

    if (promptsRes.ok) {
      const prompts = await promptsRes.json();
      const promptsData = prompts.data || prompts;
      if (Array.isArray(promptsData)) {
        promptsData.forEach((prompt: any) => {
          sitemap.push({
            url: `${SITE_URL}/ko/prompts/${prompt.id}`,
            lastModified: prompt.updatedAt ? new Date(prompt.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    }
  } catch (err) {
    console.error('Failed to generate dynamic sitemap:', err);
  }

  return sitemap;
}
