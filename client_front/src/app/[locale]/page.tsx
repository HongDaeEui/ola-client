import { useTranslations } from 'next-intl';
import { API_BASE } from '@/lib/api';
import HomeClient from '@/components/HomeClient';

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

async function getFeaturedTools(): Promise<Tool[]> {
  try {
    const res = await fetch(`${API_BASE}/tools/ranking`, { next: { revalidate: 300 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}
async function getRecentPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_BASE}/posts/ranking`, { next: { revalidate: 120 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}
async function getTopCategories(): Promise<CategoryCount[]> {
  try {
    const res = await fetch(`${API_BASE}/tools/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data: CategoryCount[] = await res.json();
    return data.slice(0, 8);
  } catch { return []; }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations('Home');
  const [tools, posts, categories] = await Promise.all([
    getFeaturedTools(),
    getRecentPosts(),
    getTopCategories(),
  ]);

  return <HomeClient tools={tools} posts={posts} categories={categories} />;
}
