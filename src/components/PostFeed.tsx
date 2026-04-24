"use client";
import { API_BASE } from '@/lib/api';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@/i18n/routing';
export const runtime = "edge";
export const revalidate = 300;

const LIMIT = 10;

interface Author {
  username: string;
  avatarUrl: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  views: number;
  createdAt: string;
  author: Author;
}

const CATEGORY_COLORS: Record<string, string> = {
  '실천형 노하우': 'text-sky-600 bg-sky-50',
  '작품 공유': 'text-rose-600 bg-rose-50',
  '자유게시판': 'text-slate-600 bg-slate-100',
  '전문 리포트': 'text-indigo-600 bg-indigo-50',
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

interface Props {
  initialPosts: Post[];
  category: string;
}

export function PostFeed({ initialPosts, category }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length === LIMIT);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const qs = new URLSearchParams({ page: String(nextPage), limit: String(LIMIT) });
      if (category !== '전체') qs.set('category', category);
      const res = await fetch(`${API_BASE}/posts?${qs}`);
      const data: Post[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === LIMIT);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, category]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-[48px] text-slate-200 mb-4 block">article</span>
        <p className="text-slate-400 font-bold mb-6">아직 게시글이 없습니다.</p>
        <Link href="/community/write"
          className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-700 transition-all">
          <span className="material-symbols-outlined text-[18px]">edit</span>
          첫 번째 글 쓰기
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {posts.map((post) => {
          const tagClass = CATEGORY_COLORS[post.category] ?? 'text-slate-600 bg-slate-100';
          return (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg hover:border-sky-200 dark:hover:border-sky-700 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${tagClass}`}>
                  {post.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {relativeTime(post.createdAt)}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors mb-2 tracking-tight leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {post.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {post.author?.username?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">@{post.author?.username}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                    <span className="text-xs font-bold">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span className="text-xs font-bold">{post.views}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="py-6 flex justify-center">
        {loading && (
          <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-sm text-slate-400 font-medium">모든 게시글을 불러왔어요 ✓</p>
        )}
      </div>
    </>
  );
}
