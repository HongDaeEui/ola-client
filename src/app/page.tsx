import HomeClient from '@/components/HomeClient';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://ola-backend-psi.vercel.app/api';

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
    const res = await fetch(`${API}/tools/ranking`, { next: { revalidate: 300 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}
async function getRecentPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API}/posts/ranking`, { next: { revalidate: 120 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}
async function getTopCategories(): Promise<CategoryCount[]> {
  try {
    const res = await fetch(`${API}/tools/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data: CategoryCount[] = await res.json();
    return data.slice(0, 8);
  } catch { return []; }
}

export default async function Home() {
  const [tools, posts, categories] = await Promise.all([
    getFeaturedTools(),
    getRecentPosts(),
    getTopCategories(),
  ]);

  return <HomeClient tools={tools} posts={posts} categories={categories} />;
}
