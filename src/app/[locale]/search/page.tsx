'use client';

import { API_BASE } from '@/lib/api';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';
import { Link } from '@/i18n/routing';
import { OlaVerifiedBadge } from '@/components/Badges';



type Tool = { id: string; name: string; shortDesc: string; category: string; iconUrl?: string; pricingModel?: string; rating?: number };
type Prompt = { id: string; title: string; category: string; toolName: string; likes: number };
type Post = { id: string; title: string; category: string; likes: number; views: number; createdAt: string };
type Lab = { id: string; title: string; description: string; category: string; emoji?: string; difficulty?: string; likes: number };

type Results = { tools: Tool[]; prompts: Prompt[]; posts: Post[]; labs: Lab[] };

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'tools', label: '도구' },
  { key: 'prompts', label: '프롬프트' },
  { key: 'posts', label: '커뮤니티' },
  { key: 'labs', label: 'AI 실험실' },
] as const;

type Tab = (typeof TABS)[number]['key'];

const DIFFICULTY_COLOR: Record<string, string> = {
  '입문': 'bg-emerald-100 text-emerald-700',
  '중급': 'bg-amber-100 text-amber-700',
  '고급': 'bg-red-100 text-red-700',
};

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-200 rounded-sm px-0.5 not-italic">{part}</mark>
      : part
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(q);
    if (!q) { setResults(null); return; }
    setLoading(true);
    fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then((data: Results) => { setResults(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const totalCount = results
    ? results.tools.length + results.prompts.length + results.posts.length + results.labs.length
    : 0;

  const counts: Record<Tab, number> = {
    all: totalCount,
    tools: results?.tools.length ?? 0,
    prompts: results?.prompts.length ?? 0,
    posts: results?.posts.length ?? 0,
    labs: results?.labs.length ?? 0,
  };

  const showTools = tab === 'all' || tab === 'tools';
  const showPrompts = tab === 'all' || tab === 'prompts';
  const showPosts = tab === 'all' || tab === 'posts';
  const showLabs = tab === 'all' || tab === 'labs';

  return (
    <main className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900">
      {/* Search hero */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">search</span>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="도구, 프롬프트, 실험, 커뮤니티 글 검색..."
              className="w-full pl-12 pr-20 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 focus:border-sky-400 outline-none text-lg font-medium text-slate-800 placeholder:text-slate-400 transition-all shadow-sm"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors"
            >
              검색
            </button>
          </form>
          {q && !loading && results && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 pl-1">
              <span className="font-semibold text-slate-700 dark:text-slate-200">&quot;{q}&quot;</span> 검색 결과 {totalCount}건
            </p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* Tabs */}
        {results && totalCount > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  tab === t.key
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300'
                }`}
              >
                {t.label}
                {counts[t.key] > 0 && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    {counts[t.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-8 mt-6">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700/50 rounded-full mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(key => (
                  <div key={key} className="flex gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700/50 flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-full" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-6 text-sky-500 animate-pulse">
              <span className="material-symbols-outlined text-3xl mb-2">auto_awesome</span>
              <p className="text-sm font-semibold tracking-widest uppercase">AI is analyzing results...</p>
            </div>
          </div>
        )}

        {/* Empty state — no query */}
        {!loading && !q && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">manage_search</span>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">궁금한 AI 도구나 주제를 검색해보세요</p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {['ChatGPT', 'Midjourney', '이미지 생성', 'Cursor', '자동화', 'Suno'].map(hint => (
                <button
                  key={hint}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(hint)}`)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-600 transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state — no results */}
        {!loading && q && results && totalCount === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">search_off</span>
            <p className="mt-4 text-slate-700 dark:text-slate-300 font-semibold text-lg">&quot;{q}&quot;에 대한 결과가 없어요</p>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">다른 키워드로 검색하거나, 커뮤니티에 글을 남겨보세요</p>
            <Link href="/community/write" className="mt-6 inline-block bg-sky-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors">
              커뮤니티에 질문하기
            </Link>
          </div>
        )}

        {/* Results */}
        {!loading && results && totalCount > 0 && (
          <div className="space-y-8">
            {/* Tools */}
            {showTools && results.tools.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                  도구 <span className="text-sky-500">{results.tools.length}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.tools.map(tool => (
                    <Link key={tool.id} href={`/tools/${tool.id}`}
                      className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-md transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/40 dark:to-indigo-900/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {tool.iconUrl
                          ? <img src={tool.iconUrl} alt={tool.name} className="w-full h-full object-cover" />
                          : <span className="material-symbols-outlined text-sky-500 text-2xl">extension</span>
                        }
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 truncate">{highlight(tool.name, q)}</p>
                          {(tool.rating || 0) > 4.5 && <OlaVerifiedBadge />}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{highlight(tool.shortDesc, q)}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{tool.category}</span>
                          {tool.pricingModel && (
                            <span className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">{tool.pricingModel}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Labs */}
            {showLabs && results.labs.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                  AI 실험실 <span className="text-purple-500">{results.labs.length}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.labs.map(lab => (
                    <Link key={lab.id} href={`/labs/${lab.id}`}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 leading-tight">
                          {lab.emoji && <span className="mr-1.5">{lab.emoji}</span>}{highlight(lab.title, q)}
                        </p>
                        {lab.difficulty && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${DIFFICULTY_COLOR[lab.difficulty] ?? 'bg-slate-100 text-slate-500'}`}>
                            {lab.difficulty}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{highlight(lab.description, q)}</p>
                      <span className="mt-2 inline-block text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{lab.category}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Prompts */}
            {showPrompts && results.prompts.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                  프롬프트 <span className="text-amber-500">{results.prompts.length}</span>
                </h2>
                <div className="flex flex-col gap-2">
                  {results.prompts.map(p => (
                    <Link key={p.id} href={`/prompts/${p.id}`}
                      className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-700 hover:shadow-sm transition-all group"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-amber-600">{highlight(p.title, q)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.toolName} · {p.category}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                        <span className="material-symbols-outlined text-base">favorite</span>
                        {p.likes}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Posts */}
            {showPosts && results.posts.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                  커뮤니티 <span className="text-rose-500">{results.posts.length}</span>
                </h2>
                <div className="flex flex-col gap-2">
                  {results.posts.map(post => (
                    <Link key={post.id} href={`/community/${post.id}`}
                      className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-700 hover:shadow-sm transition-all group"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-rose-600">{highlight(post.title, q)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {post.category} · {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">visibility</span>{post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">favorite</span>{post.likes}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
