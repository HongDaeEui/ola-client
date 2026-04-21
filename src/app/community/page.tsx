import Link from 'next/link';
import { WriteFAB } from '@/components/WriteFAB';
import { PostFeed, type Post } from '@/components/PostFeed';

const API = 'https://ola-backend-psi.vercel.app/api';
const LIMIT = 10;

interface Meetup {
  id: string;
  title: string;
  date: string;
  location: string;
  isVirtual: boolean;
  status: string;
  _count: { attendees: number };
}

interface TagStat {
  category: string;
  postCount: number;
  totalLikes: number;
  totalViews: number;
}

function meetupType(meetup: Meetup): string {
  return meetup.isVirtual ? '온라인' : `오프라인 · ${meetup.location}`;
}

function meetupStatusLabel(status: string): string {
  if (status === 'UPCOMING') return '모집중';
  if (status === 'LIVE') return '진행중';
  return '완료';
}

async function getPosts(category?: string): Promise<Post[]> {
  try {
    const qs = new URLSearchParams({ page: '1', limit: String(LIMIT) });
    if (category && category !== '전체') qs.set('category', category);
    const res = await fetch(`${API}/posts?${qs}`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[CommunityPage] getPosts Error:', e);
    return [];
  }
}

async function getUpcomingMeetups(): Promise<Meetup[]> {
  try {
    const res = await fetch(`${API}/meetups/upcoming`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[CommunityPage] getUpcomingMeetups Error:', e);
    return [];
  }
}

async function getTagStats(): Promise<TagStat[]> {
  try {
    const res = await fetch(`${API}/posts/tag-stats`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[CommunityPage] getTagStats Error:', e);
    return [];
  }
}

const CATEGORIES = ['전체', '실천형 노하우', '작품 공유', '자유게시판', '전문 리포트'];

const TAG_ACTIVE_COLORS: Record<string, string> = {
  '실천형 노하우': 'bg-sky-600 text-white border-sky-600',
  '작품 공유': 'bg-rose-500 text-white border-rose-500',
  '자유게시판': 'bg-slate-600 text-white border-slate-600',
  '전문 리포트': 'bg-indigo-600 text-white border-indigo-600',
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category ?? '전체';

  const [posts, meetups, tagStats] = await Promise.all([
    getPosts(activeCategory),
    getUpcomingMeetups(),
    getTagStats(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main Feed */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">Ola 커뮤니티</h1>
              <Link href="/community/write"
                className="hidden sm:flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                글쓰기
              </Link>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  href={cat === '전체' ? '/community' : `/community?category=${encodeURIComponent(cat)}`}
                  className={`px-4 pb-3 pt-1 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                    activeCategory === cat
                      ? 'text-sky-600 border-sky-600'
                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Post Feed with infinite scroll */}
            <PostFeed key={activeCategory} initialPosts={posts} category={activeCategory} />
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-96 space-y-8">

            {/* Write CTA */}
            <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
              <h3 className="font-black text-lg mb-2 relative z-10">당신의 경험을 나눠주세요</h3>
              <p className="text-sky-100 text-sm leading-relaxed mb-5 relative z-10">
                AI 툴로 해낸 것들, 실패한 경험, 발견한 꿀팁 — 모두 커뮤니티에 큰 도움이 됩니다.
              </p>
              <Link href="/community/write"
                className="relative z-10 inline-flex items-center gap-2 bg-white text-sky-600 px-5 py-2.5 rounded-xl font-black text-sm hover:bg-sky-50 transition-all">
                <span className="material-symbols-outlined text-[16px]">edit</span>
                글 쓰러 가기
              </Link>
            </div>

            {/* Trending Tags */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                인기 토픽
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-6">실제 게시글 기준 · 좋아요순</p>
              {tagStats.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">데이터를 불러오는 중...</p>
              ) : (
                <div className="space-y-2">
                  {tagStats.map((stat, i) => {
                    const isActive = activeCategory === stat.category;
                    const activeStyle = TAG_ACTIVE_COLORS[stat.category] ?? 'bg-sky-600 text-white border-sky-600';
                    const inactiveStyle = 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600';
                    return (
                      <Link
                        key={stat.category}
                        href={`/community?category=${encodeURIComponent(stat.category)}`}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border font-bold text-sm transition-all ${isActive ? activeStyle : inactiveStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[11px] font-black w-5 text-center ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                            {i + 1}
                          </span>
                          <span>{stat.category}</span>
                        </div>
                        <div className={`flex items-center gap-3 text-[11px] font-bold ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">article</span>
                            {stat.postCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">thumb_up</span>
                            {stat.totalLikes}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                  {activeCategory !== '전체' && (
                    <Link
                      href="/community"
                      className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors mt-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                      필터 해제
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Upcoming Meetups */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500">groups</span>
                진행 중인 스터디
              </h3>
              {meetups.length === 0 ? (
                <p className="text-sm text-slate-400 font-medium text-center py-4">예정된 모임이 없습니다.</p>
              ) : (
                <div className="space-y-6">
                  {meetups.map((m) => {
                    const status = meetupStatusLabel(m.status);
                    return (
                      <div key={m.id} className="group cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                            status === '모집중' ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : status === '진행중' ? 'bg-sky-50 text-sky-600 border-sky-100'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>{status}</span>
                          <span className="text-xs font-bold text-slate-400">{meetupType(m)}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 transition-colors mb-2 leading-tight">
                          {m.title}
                        </h4>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">{new Date(m.date).toLocaleDateString('ko-KR')}</span>
                          <span className="text-slate-900 dark:text-slate-200 font-bold">{m._count?.attendees ?? 0}명 참여</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link href="/meetups" className="block mt-8">
                <button className="w-full py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  모든 모임 탐색
                </button>
              </Link>
            </div>

          </aside>
        </div>
      </div>

      {/* Mobile FAB */}
      <WriteFAB />
    </div>
  );
}
