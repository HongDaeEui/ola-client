'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

interface SearchResult {
  title: string;
  url: string;
  category: '도구' | '커뮤니티' | '실험실' | '프롬프트';
  icon: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Set focus on open
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Simulate debounced search (integrate with Ola search API in future/now)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          const parsed: SearchResult[] = [];
          (data.tools || []).slice(0, 3).forEach((t: any) => parsed.push({ title: t.name, url: `/tools/${t.id}`, category: '도구', icon: 'extension' }));
          (data.labs || []).slice(0, 2).forEach((l: any) => parsed.push({ title: l.title, url: `/labs/${l.id}`, category: '실험실', icon: 'science' }));
          (data.prompts || []).slice(0, 2).forEach((p: any) => parsed.push({ title: p.title, url: `/prompts/${p.id}`, category: '프롬프트', icon: 'terminal' }));
          (data.posts || []).slice(0, 2).forEach((p: any) => parsed.push({ title: p.title, url: `/community/${p.id}`, category: '커뮤니티', icon: 'forum' }));
          setResults(parsed);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const handleSelect = (url: string) => {
    router.push(url);
    close();
  };

  const handleGlobalSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      close();
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-sm font-medium"
      >
        <span className="material-symbols-outlined text-[18px]">search</span>
        <span>Quick Search...</span>
        <kbd className="hidden lg:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-10"
            >
              {/* Search Header */}
              <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-slate-400 text-2xl">search</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') close();
                    if (e.key === 'Enter') handleGlobalSearch();
                  }}
                  placeholder="무엇이든 검색하세요... (도구, 커뮤니티, 멤버)"
                  className="flex-1 w-full bg-transparent px-4 py-5 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-lg"
                />
                <button onClick={close} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                  <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500">ESC</kbd>
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {!query.trim() && (
                  <div className="px-4 py-6 text-center text-slate-500">
                    <p className="text-sm font-medium mb-4">자주 찾는 액션</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button onClick={() => handleSelect('/tools')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700">전체 도구 보기</button>
                      <button onClick={() => handleSelect('/community/write')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700">커뮤니티 글쓰기</button>
                      <button onClick={() => handleSelect('/labs')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700">AI 실험실 모음</button>
                    </div>
                  </div>
                )}
                
                {loading && (
                  <div className="px-4 py-8 text-center text-slate-400 flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-sm">검색 중...</span>
                  </div>
                )}

                {!loading && query && results.length === 0 && (
                  <div className="px-4 py-8 text-center text-slate-500">
                    검색 결과가 없습니다.
                    <p className="text-xs mt-2 text-sky-500 cursor-pointer hover:underline" onClick={handleGlobalSearch}>
                      &quot;{query}&quot; 전체 검색하기 &rarr;
                    </p>
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div className="py-2">
                    {/* Group by category logic simplified for palette */}
                    {results.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(res.url)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-sky-500 text-[18px]">{res.icon}</span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">{res.title}</span>
                        </div>
                        <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 border border-slate-200 dark:border-slate-700">
                          {res.category}
                        </span>
                      </button>
                    ))}
                    <div className="px-4 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                      <button onClick={handleGlobalSearch} className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center justify-center gap-1 w-full p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800/50">
                        전체 결과 더보기
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
