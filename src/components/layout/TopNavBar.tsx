"use client";
import { API_BASE } from '@/lib/api';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationBell } from '@/components/NotificationBell';
import { CommandPalette } from '@/components/CommandPalette';


interface Suggestions {
  tools: { id: string; name: string; category: string; iconUrl: string | null }[];
  prompts: { id: string; title: string; toolName: string }[];
  posts: { id: string; title: string; category: string }[];
  labs: { id: string; title: string; emoji: string }[];
}

function SearchDropdown({ suggestions, onClose }: { suggestions: Suggestions; onClose: () => void }) {
  const total = suggestions.tools.length + suggestions.prompts.length + suggestions.posts.length + suggestions.labs.length;
  if (total === 0) return null;

  return (
    <div className="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
      {suggestions.tools.length > 0 && (
        <div>
          <p className="px-3 pt-3 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">도구</p>
          {suggestions.tools.map(t => (
            <Link key={t.id} href={`/tools/${t.id}`} onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors">
              {t.iconUrl
                ? <img src={t.iconUrl} alt={t.name} className="w-6 h-6 rounded-lg object-cover flex-shrink-0" />
                : <span className="material-symbols-outlined text-[18px] text-slate-400 flex-shrink-0">extension</span>}
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{t.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      {suggestions.prompts.length > 0 && (
        <div>
          <p className="px-3 pt-2 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">프롬프트</p>
          {suggestions.prompts.map(p => (
            <Link key={p.id} href={`/prompts/${p.id}`} onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-violet-400 flex-shrink-0">psychology</span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{p.title}</p>
            </Link>
          ))}
        </div>
      )}
      {suggestions.posts.length > 0 && (
        <div>
          <p className="px-3 pt-2 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">커뮤니티</p>
          {suggestions.posts.map(p => (
            <Link key={p.id} href={`/community/${p.id}`} onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-emerald-400 flex-shrink-0">forum</span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{p.title}</p>
            </Link>
          ))}
        </div>
      )}
      {suggestions.labs.length > 0 && (
        <div>
          <p className="px-3 pt-2 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">AI 실험실</p>
          {suggestions.labs.map(l => (
            <Link key={l.id} href={`/labs/${l.id}`} onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors">
              <span className="text-lg flex-shrink-0">{l.emoji}</span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{l.title}</p>
            </Link>
          ))}
        </div>
      )}
      <div className="border-t border-slate-100 dark:border-slate-700 px-3 py-2 mt-1">
        <p className="text-[11px] text-slate-400 text-center">Enter를 눌러 전체 검색</p>
      </div>
    </div>
  );
}

export function TopNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestions>({ tools: [], prompts: [], posts: [], labs: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const fetchSuggestions = useCallback((q: string) => {
    clearTimeout(debounceRef.current);
    if (q.trim().length < 2) { setSuggestions({ tools: [], prompts: [], posts: [], labs: [] }); setShowDropdown(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/search/suggest?q=${encodeURIComponent(q.trim())}`);
        const data: Suggestions = await res.json();
        setSuggestions(data);
        const hasAny = data.tools.length + data.prompts.length + data.posts.length + data.labs.length > 0;
        setShowDropdown(hasAny);
      } catch { /* ignore */ }
    }, 300);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    fetchSuggestions(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const closeDropdown = () => {
    setShowDropdown(false);
    setSearchOpen(false);
    setSearchQuery('');
    setSuggestions({ tools: [], prompts: [], posts: [], labs: [] });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-[1920px] mx-auto">

          <div className="flex items-center">
            <Link href="/" className="flex items-center group p-1 -ml-1">
               <img
                 src="/logo.png"
                 alt="Ola All-round AI club"
                 className="h-14 md:h-16 w-auto object-contain bg-transparent group-hover:scale-105 transition-transform"
               />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-10 font-['Noto_Sans_KR'] font-bold text-[15px] tracking-wide ml-8">
            <Link href="/tools" className="text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:-translate-y-0.5 transition-all duration-300">
              도구 탐색
            </Link>
            <Link href="/labs" className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 hover:-translate-y-0.5 transition-all duration-300">
              <span className="material-symbols-outlined text-[18px] text-sky-500">science</span>
              AI 실험실
            </Link>
            <Link href="/categories" className="text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:-translate-y-0.5 transition-all duration-300">
              카테고리
            </Link>
            <Link href="/ranking" className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 hover:-translate-y-0.5 transition-all duration-300">
              <span className="material-symbols-outlined text-[18px] text-amber-500">local_fire_department</span>
              인기 랭킹
            </Link>
            <Link href="/prompts" className="text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:-translate-y-0.5 transition-all duration-300">
              프롬프트
            </Link>
            <Link href="/community" className="text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:-translate-y-0.5 transition-all duration-300">
              커뮤니티
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Spotlight Search (desktop) */}
            <CommandPalette />

            <Link href="/submit" className="hidden lg:flex text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-bold mr-2">
              + 도구 제출
            </Link>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons */}
            {!loading && (
              user ? (
                <div className="hidden sm:flex items-center gap-3">
                  <Link href="/profile">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm uppercase hover:scale-105 transition-transform cursor-pointer">
                      {user.user_metadata?.name?.charAt(0) ?? user.email?.charAt(0) ?? 'U'}
                    </div>
                  </Link>
                  <button
                    onClick={signOut}
                    className="rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="hidden sm:flex items-center gap-2 rounded-xl bg-sky-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-sky-700 transition-all shadow-md shadow-sky-100"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google로 로그인
                </button>
              )
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-white dark:bg-slate-900 z-40 transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col h-full pt-28 px-6 pb-6 overflow-y-auto">
          {/* Mobile search */}
          <div className="mb-6 relative">
            <form onSubmit={(e) => { handleSearchSubmit(e); setIsMobileMenuOpen(false); }}>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <input
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="검색..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-sky-400 outline-none text-base font-medium text-slate-800 dark:text-slate-100"
                />
              </div>
            </form>
            {showDropdown && (
              <div className="mt-1">
                <SearchDropdown suggestions={suggestions} onClose={closeDropdown} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6 text-xl font-bold text-slate-800 dark:text-slate-200 font-['Noto_Sans_KR']">
            <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 dark:border-slate-800 pb-4">도구 탐색</Link>
            <Link href="/labs" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-500">science</span> AI 실험실
            </Link>
            <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 dark:border-slate-800 pb-4">카테고리</Link>
            <Link href="/ranking" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
              인기 랭킹 <span className="material-symbols-outlined text-amber-500">local_fire_department</span>
            </Link>
            <Link href="/prompts" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 dark:border-slate-800 pb-4">프롬프트</Link>
            <Link href="/community" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-slate-100 dark:border-slate-800 pb-4">커뮤니티</Link>
            <Link href="/submit" onClick={() => setIsMobileMenuOpen(false)} className="text-sky-600 pb-4">+ 도구 제안하기</Link>
          </div>
          <div className="mt-auto pt-8">
            {user ? (
              <div className="flex flex-col gap-3">
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold uppercase">
                      {user.user_metadata?.name?.charAt(0) ?? user.email?.charAt(0) ?? 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{user.user_metadata?.name ?? '사용자'}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </Link>
                <button onClick={signOut} className="w-full py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="w-full py-4 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center gap-2"
              >
                Google로 로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
