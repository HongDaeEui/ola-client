import Link from 'next/link';
import { WriteFAB } from '@/components/WriteFAB';

const API = 'https://ola-backend-psi.vercel.app/api';

interface Author {
  username: string;
  avatarUrl: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  views: number;
  createdAt: string;
  author: Author;
}

interface Meetup {
  id: string;
  title: string;
  date: string;
  location: string;
  isVirtual: boolean;
  status: string;
  _count: { attendees: number };
}

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
    const url = category && category !== '전체'
      ? `${API}/posts?category=${encodeURIComponent(category)}`
      : `${API}/posts`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getUpcomingMeetups(): Promise<Meetup[]> {
  try {
    const res = await fetch(`${API}/meetups/upcoming`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const CATEGORIES = ['전체', '실천형 노하우', '작품 공유', '자유게시판', '전문 리포트'];

const CATEGORY_COLORS: Record<string, string> = {
  '실천형 노하우': 'text-sky-600 bg-sky-50',
  '작품 공유': 'text-rose-600 bg-rose-50',
  '자유게시판': 'text-slate-600 bg-slate-100',
  '전문 리포트': 'text-indigo-600 bg-indigo-50',
};

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category ?? '전체';

  const [posts, meetups] = await Promise.all([
    getPosts(activeCategory),
    getUpcomingMeetups(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main Feed */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">Ola 커뮤니티</h1>
              <Link href="/community/write"
                className="hidden sm:flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                글쓰기
              </Link>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 border-b border-slate-200 mb-8 overflow-x-auto">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  href={cat === '전체' ? '/community' : `/community?category=${encodeURIComponent(cat)}`}
                  className={`px-4 pb-3 pt-1 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                    activeCategory === cat
                      ? 'text-sky-600 border-sky-600'
                      : 'text-slate-500 border-transparent hover:text-slate-800'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Post List */}
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-[48px] text-slate-200 mb-4 block">article</span>
                <p className="text-slate-400 font-bold mb-6">아직 게시글이 없습니다.</p>
                <Link href="/community/write"
                  className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-700 transition-all">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  첫 번째 글 쓰기
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => {
                  const tagClass = CATEGORY_COLORS[post.category] ?? 'text-slate-600 bg-slate-100';
                  return (
                    <Link
                      key={post.id}
                      href={`/community/${post.id}`}
                      className="block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-sky-200 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${tagClass}`}>
                          {post.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {relativeTime(post.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors mb-2 tracking-tight leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                            {post.author?.username?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm font-bold text-slate-600">@{post.author?.username}</span>
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
            )}
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

            {/* Upcoming Meetups */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
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
                        <h4 className="font-extrabold text-slate-800 group-hover:text-sky-600 transition-colors mb-2 leading-tight">
                          {m.title}
                        </h4>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">{new Date(m.date).toLocaleDateString('ko-KR')}</span>
                          <span className="text-slate-900 font-bold">{m._count?.attendees ?? 0}명 참여</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link href="/meetups" className="block mt-8">
                <button className="w-full py-3 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors">
                  모든 모임 탐색
                </button>
              </Link>
            </div>

            {/* Trending Tags */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">인기 토픽</h3>
              <div className="flex flex-wrap gap-2">
                {['#에이전트실무', '#프롬프트엔지니어링', '#AI로수익화', '#이미지생성', '#개발자동화', '#Suno작곡'].map(tag => (
                  <span key={tag} className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-sky-50 hover:text-sky-600 transition-all cursor-pointer border border-transparent hover:border-sky-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Mobile FAB */}
      <WriteFAB />
    </div>
  );
}
