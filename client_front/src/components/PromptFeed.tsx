"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import CopyButton from '@/app/prompts/CopyButton';

const API = 'https://ola-backend-psi.vercel.app/api';
const LIMIT = 12;

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  toolName: string;
  likes: number;
  views: number;
  author: { username: string; avatarUrl?: string };
}

interface Props {
  initialPrompts: Prompt[];
  category: string;
}

export function PromptFeed({ initialPrompts, category }: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPrompts.length === LIMIT);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const qs = new URLSearchParams({ page: String(nextPage), limit: String(LIMIT) });
      if (category) qs.set('category', category);
      const res = await fetch(`${API}/prompts?${qs}`);
      const data: Prompt[] = await res.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPrompts(prev => [...prev, ...data]);
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

  if (prompts.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-6xl text-slate-200">search_off</span>
        <p className="mt-4 text-slate-500 font-medium">해당 카테고리의 프롬프트가 없어요.</p>
        <Link href="/prompts" className="mt-4 inline-block text-sky-600 font-bold text-sm hover:underline">
          전체 보기 →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((p) => (
          <Link
            key={p.id}
            href={`/prompts/${p.id}`}
            className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-xl hover:shadow-sky-50 transition-all group"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-2.5 py-1 rounded border border-sky-100">
                  {p.toolName}
                </span>
                <span className="text-xs font-bold text-slate-400">#{p.category}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                {p.title}
              </h3>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative mb-4">
                <p className="text-sm text-slate-600 font-mono italic leading-relaxed line-clamp-4">
                  {p.content}
                </p>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent rounded-2xl pointer-events-none" />
                <CopyButton text={p.content} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase overflow-hidden">
                  {p.author?.username?.charAt(0) ?? '?'}
                </div>
                <span className="text-xs font-bold text-slate-500">@{p.author?.username ?? 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">thumb_up</span>
                  <span className="text-[10px] font-bold">{p.likes ?? 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">visibility</span>
                  <span className="text-[10px] font-bold">{p.views ?? 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="py-8 flex justify-center">
        {loading && (
          <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        )}
        {!hasMore && prompts.length > 0 && (
          <p className="text-sm text-slate-400 font-medium">모든 프롬프트를 불러왔어요 ✓</p>
        )}
      </div>
    </>
  );
}
