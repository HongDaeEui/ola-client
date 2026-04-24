"use client";
import Image from "next/image";
import { API_BASE } from '@/lib/api';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
export const revalidate = 300;

const supabase = createClient();


type Tab = 'overview' | 'posts' | 'prompts' | 'bookmarks';

interface MyPost {
  id: string;
  title: string;
  category: string;
  likes: number;
  views: number;
  createdAt: string;
}

interface MyPrompt {
  id: string;
  title: string;
  category: string;
  toolName: string;
  likes: number;
  views: number;
  createdAt: string;
}

interface BookmarkItem {
  id: string;
  targetType: string;
  targetId: string;
  createdAt: string;
  item: {
    id: string;
    title?: string;
    name?: string;
    category: string;
    toolName?: string;
    shortDesc?: string;
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  '실천형 노하우': 'text-sky-600 bg-sky-50',
  '작품 공유': 'text-rose-600 bg-rose-50',
  '자유게시판': 'text-slate-600 bg-slate-100',
  '전문 리포트': 'text-indigo-600 bg-indigo-50',
};

const TYPE_META: Record<string, { label: string; icon: string; color: string; href: (id: string) => string }> = {
  POST:   { label: '커뮤니티',  icon: 'forum',        color: 'text-emerald-500 bg-emerald-50', href: id => `/community/${id}` },
  PROMPT: { label: '프롬프트', icon: 'auto_awesome',  color: 'text-amber-500 bg-amber-50',    href: id => `/prompts/${id}` },
  TOOL:   { label: '도구',     icon: 'build',         color: 'text-sky-500 bg-sky-50',        href: id => `/tools/${id}` },
  LAB:    { label: '실험실',   icon: 'science',       color: 'text-purple-500 bg-purple-50',  href: id => `/labs/${id}` },
};

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [prompts, setPrompts] = useState<MyPrompt[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    if (tab === 'posts' && posts.length === 0) {
      setDataLoading(true);
      fetch(`${API_BASE}/posts?userEmail=${encodeURIComponent(user.email!)}`)
        .then(r => r.json())
        .then(d => setPosts(d))
        .catch(() => {})
        .finally(() => setDataLoading(false));
    }
    if (tab === 'prompts' && prompts.length === 0) {
      setDataLoading(true);
      fetch(`${API_BASE}/prompts?userEmail=${encodeURIComponent(user.email!)}`)
        .then(r => r.json())
        .then(d => setPrompts(d))
        .catch(() => {})
        .finally(() => setDataLoading(false));
    }
    if (tab === 'bookmarks' && bookmarks.length === 0) {
      setDataLoading(true);
      (async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;
          if (!token) {
            setBookmarks([]);
            return;
          }
          const res = await fetch(`${API_BASE}/bookmarks`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const d = await res.json();
          setBookmarks(d);
        } catch {
          setBookmarks([]);
        } finally {
          setDataLoading(false);
        }
      })();
    }
  }, [tab, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const displayName = user.user_metadata?.name ?? user.user_metadata?.full_name ?? '사용자';
  const avatarUrl = user.user_metadata?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview',   label: '프로필',     icon: 'person' },
    { key: 'posts',      label: '내 글',      icon: 'edit_note' },
    { key: 'prompts',    label: '내 프롬프트', icon: 'auto_awesome' },
    { key: 'bookmarks',  label: '북마크',     icon: 'bookmark' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 font-['Noto_Sans_KR']">
      <div className="max-w-2xl mx-auto px-4">

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-6">
          <div className="h-28 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500" />
          <div className="px-6 pb-6">
            <div className="-mt-10 mb-4 flex items-end justify-between">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName}
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-md object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-md bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                  {initial}
                </div>
              )}
              <button onClick={signOut}
                className="text-xs text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
                로그아웃
              </button>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{displayName}</h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-0.5">{user.email}</p>
            <div className="mt-3 flex gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-bold border border-sky-100">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                Google 계정
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold border border-slate-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                {new Date(user.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })} 가입
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-1 mb-6 shadow-sm">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.key ? 'bg-slate-900 dark:bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}>
              <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">계정 정보</h2>
              <div className="space-y-3">
                {[
                  { label: '이름', value: displayName },
                  { label: '이메일', value: user.email ?? '' },
                  { label: '가입일', value: new Date(user.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700 last:border-0">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">바로가기</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: '/tools',     icon: 'build',        label: '도구 탐색',   color: 'text-sky-500' },
                  { href: '/labs',      icon: 'science',      label: 'AI 실험실',  color: 'text-purple-500' },
                  { href: '/prompts',   icon: 'auto_awesome', label: '프롬프트',   color: 'text-amber-500' },
                  { href: '/community', icon: 'forum',        label: '커뮤니티',   color: 'text-emerald-500' },
                  { href: '/submit',    icon: 'add_circle',   label: '도구 제출',  color: 'text-rose-500' },
                  { href: '/community/write', icon: 'edit',   label: '글 쓰기',    color: 'text-indigo-500' },
                ].map(({ href, icon, label, color }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className={`material-symbols-outlined text-[20px] ${color}`}>{icon}</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 내 글 ── */}
        {tab === 'posts' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-500">내가 쓴 글 {posts.length > 0 ? `· ${posts.length}개` : ''}</p>
              <Link href="/community/write"
                className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700">
                <span className="material-symbols-outlined text-[14px]">edit</span>
                새 글 쓰기
              </Link>
            </div>

            {dataLoading ? (
              <div className="py-16 flex justify-center">
                <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-[40px] text-slate-200 block mb-3">edit_note</span>
                <p className="text-slate-400 font-bold mb-4">아직 작성한 글이 없어요.</p>
                <Link href="/community/write"
                  className="inline-flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-sky-700 transition-all">
                  첫 글 쓰기
                </Link>
              </div>
            ) : posts.map(post => {
              const tagClass = CATEGORY_COLORS[post.category] ?? 'text-slate-600 bg-slate-100';
              return (
                <Link key={post.id} href={`/community/${post.id}`}
                  className="block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 hover:shadow-md hover:border-sky-200 dark:hover:border-sky-700 transition-all group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${tagClass}`}>{post.category}</span>
                    <span className="text-xs text-slate-400">{relativeTime(post.createdAt)}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors leading-snug mb-3">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>{post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">visibility</span>{post.views}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── 내 프롬프트 ── */}
        {tab === 'prompts' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-500">내 프롬프트 {prompts.length > 0 ? `· ${prompts.length}개` : ''}</p>
              <Link href="/prompts/write"
                className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700">
                <span className="material-symbols-outlined text-[14px]">add</span>
                프롬프트 공유하기
              </Link>
            </div>

            {dataLoading ? (
              <div className="py-16 flex justify-center">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : prompts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-[40px] text-slate-200 block mb-3">auto_awesome</span>
                <p className="text-slate-400 font-bold mb-4">아직 공유한 프롬프트가 없어요.</p>
                <Link href="/prompts/write"
                  className="inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-all">
                  첫 프롬프트 공유하기
                </Link>
              </div>
            ) : prompts.map(prompt => (
              <Link key={prompt.id} href={`/prompts/${prompt.id}`}
                className="block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-700 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600">{prompt.category}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500">{prompt.toolName}</span>
                  <span className="text-xs text-slate-400 ml-auto">{relativeTime(prompt.createdAt)}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors leading-snug mb-3">
                  {prompt.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">thumb_up</span>{prompt.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">visibility</span>{prompt.views}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── 북마크 ── */}
        {tab === 'bookmarks' && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-slate-500 mb-2">
              저장한 항목 {bookmarks.length > 0 ? `· ${bookmarks.length}개` : ''}
            </p>

            {dataLoading ? (
              <div className="py-16 flex justify-center">
                <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-[40px] text-slate-200 block mb-3">bookmark</span>
                <p className="text-slate-400 font-bold mb-4">저장한 항목이 없어요.</p>
                <p className="text-xs text-slate-400">도구, 프롬프트, 커뮤니티 글에서 북마크 버튼을 눌러보세요.</p>
              </div>
            ) : bookmarks.map(b => {
              const meta = TYPE_META[b.targetType] ?? TYPE_META.POST;
              const title = b.item.title ?? b.item.name ?? '제목 없음';
              return (
                <Link key={b.id} href={meta.href(b.targetId)}
                  className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 hover:shadow-md hover:border-sky-200 dark:hover:border-sky-700 transition-all group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
                    <span className="material-symbols-outlined text-[20px]">{meta.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors truncate text-sm">
                      {title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {meta.label} · {b.item.category}
                      {b.item.toolName ? ` · ${b.item.toolName}` : ''}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-slate-300 group-hover:text-sky-400 transition-colors shrink-0">
                    chevron_right
                  </span>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
