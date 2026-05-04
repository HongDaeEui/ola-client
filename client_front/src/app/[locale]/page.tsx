import { API_BASE, apiFetch } from '@/lib/api';
import HomeClient from '@/components/HomeClient';
export const revalidate = 300;

interface Tool {
  id: string; name: string; shortDesc: string; description: string;
  category: string; pricingModel?: string; rating: number;
  tags: string[]; iconUrl?: string; coverUrl?: string; isFeatured: boolean;
}
interface Post {
  id: string; title: string; category: string; views: number; likes: number;
  createdAt: string; author: { username: string };
}
interface CategoryCount { category: string; count: number; }

const TIMEOUT_MS = 8000;

function fetchWithTimeout(url: string, options: RequestInit & { next?: object } = {}): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)),
  ]);
}

async function getFeaturedTools(): Promise<Tool[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/tools/ranking`, { next: { revalidate: 300 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}
async function getMarqueeTools(): Promise<{ name: string; iconUrl?: string }[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/tools?limit=40`, { next: { revalidate: 300 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}
async function getRecentPosts(): Promise<Post[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/posts/ranking`, { next: { revalidate: 120 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}
async function getTopCategories(): Promise<CategoryCount[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/tools/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data: CategoryCount[] = await res.json();
    return data.slice(0, 8);
  } catch { return []; }
}

export default async function Page() {
  const [tools, posts, categories, marqueeTools] = await Promise.all([
    getFeaturedTools(),
    getRecentPosts(),
    getTopCategories(),
    getMarqueeTools(),
  ]);

  return <HomeClient tools={tools} posts={posts} categories={categories} marqueeTools={marqueeTools} />;
}
