import Link from 'next/link';
import ResourceCard from './ResourceCard';

const API = 'https://ola-backend-psi.vercel.app/api';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  contentUrl: string | null;
  reads: number;
  isFeatured: boolean;
  author: { username: string; name: string | null; avatarUrl: string | null };
}

interface TypeCount {
  type: string;
  count: number;
}

const TYPE_ICONS: Record<string, string> = {
  'Script': 'terminal',
  'Essay': 'chrome_reader_mode',
  'Deck': 'view_carousel',
  'Case Study': 'science',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  'Beginner': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Intermediate': 'bg-amber-50 text-amber-700 border-amber-100',
  'Advanced': 'bg-rose-50 text-rose-700 border-rose-100',
};

async function getResources(type?: string, difficulty?: string): Promise<Resource[]> {
  try {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (difficulty) params.set('difficulty', difficulty);
    const qs = params.toString();
    const res = await fetch(`${API}/resources${qs ? `?${qs}` : ''}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getFeaturedResources(): Promise<Resource[]> {
  try {
    const res = await fetch(`${API}/resources/featured`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getTypeCounts(): Promise<TypeCount[]> {
  try {
    const res = await fetch(`${API}/resources/type-counts`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; difficulty?: string }>;
}) {
  const { type: activeType, difficulty: activeDifficulty } = await searchParams;

  const [resources, featuredResources, typeCounts] = await Promise.all([
    getResources(activeType, activeDifficulty),
    getFeaturedResources(),
    getTypeCounts(),
  ]);

  const totalCount = typeCounts.reduce((s, t) => s + t.count, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-600 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-6">
          <span className="material-symbols-outlined text-[16px]">library_books</span>
          Learning Archive
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-4">
          The Learning<br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-indigo-600">Archive</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl mx-auto">
          커뮤니티가 만든 프롬프트 덱, 워크플로우 스크립트, 케이스 스터디
        </p>
        <p className="text-slate-400 text-sm mt-2 font-bold">{totalCount}개의 리소스</p>
      </header>

      {/* Featured Horizontal Scroll */}
      {featuredResources.length > 0 && (
        <section className="pl-6 md:pl-12 mb-16 overflow-hidden">
          <div className="flex gap-5 overflow-x-auto pb-4 pr-6 md:pr-12" style={{ scrollbarWidth: 'none' }}>
            {featuredResources.map((r, idx) => (
              <div
                key={r.id}
                className={`min-w-[340px] md:min-w-[480px] rounded-3xl p-8 relative overflow-hidden shrink-0 ${
                  idx % 2 === 0
                    ? 'bg-linear-to-br from-slate-900 to-sky-900 text-white'
                    : 'bg-linear-to-br from-indigo-600 to-violet-700 text-white'
                }`}
              >
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-wider border border-white/20 mb-5">
                  <span className="material-symbols-outlined text-[12px]">{TYPE_ICONS[r.type] ?? 'article'}</span>
                  {r.type} · Featured
                </span>
                <h2 className="text-2xl font-extrabold mb-3 leading-tight">{r.title}</h2>
                <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-2">{r.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs font-bold">by {r.author?.name ?? r.author?.username}</span>
                  {r.contentUrl ? (
                    <ResourceCard id={r.id} contentUrl={r.contentUrl} variant="featured" />
                  ) : (
                    <span className="text-white/40 text-xs font-bold">준비 중</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">

            {/* Type Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">유형</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href={activeDifficulty ? `/resources?difficulty=${activeDifficulty}` : '/resources'}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      !activeType ? 'bg-sky-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-sky-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">apps</span>
                      전체
                    </span>
                    <span className={`text-[11px] font-black ${!activeType ? 'text-white/70' : 'text-slate-400'}`}>
                      {totalCount}
                    </span>
                  </Link>
                </li>
                {typeCounts.map(tc => {
                  const isActive = activeType === tc.type;
                  const params = new URLSearchParams();
                  params.set('type', tc.type);
                  if (activeDifficulty) params.set('difficulty', activeDifficulty);
                  return (
                    <li key={tc.type}>
                      <Link
                        href={`/resources?${params.toString()}`}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                          isActive ? 'bg-sky-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-sky-600'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">{TYPE_ICONS[tc.type] ?? 'article'}</span>
                          {tc.type}
                        </span>
                        <span className={`text-[11px] font-black ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                          {tc.count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Difficulty Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">난이도</h3>
              <div className="flex flex-col gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map(d => {
                  const isActive = activeDifficulty === d;
                  const params = new URLSearchParams();
                  if (activeType) params.set('type', activeType);
                  if (!isActive) params.set('difficulty', d);
                  const href = params.toString() ? `/resources?${params.toString()}` : '/resources';
                  return (
                    <Link
                      key={d}
                      href={href}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all text-center ${
                        isActive
                          ? 'bg-sky-600 text-white border-sky-600'
                          : `${DIFFICULTY_COLORS[d] ?? 'bg-slate-50 text-slate-600 border-slate-100'} hover:border-sky-200`
                      }`}
                    >
                      {d}
                    </Link>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* Resource Grid */}
          <main className="lg:col-span-3">
            {/* Active Filter Banner */}
            {(activeType || activeDifficulty) && (
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="text-sm font-bold text-slate-500">필터:</span>
                {activeType && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-xs font-black border border-sky-200">
                    <span className="material-symbols-outlined text-[13px]">{TYPE_ICONS[activeType] ?? 'article'}</span>
                    {activeType}
                  </span>
                )}
                {activeDifficulty && (
                  <span className={`px-3 py-1.5 rounded-full text-xs font-black border ${DIFFICULTY_COLORS[activeDifficulty] ?? ''}`}>
                    {activeDifficulty}
                  </span>
                )}
                <Link href="/resources" className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-sky-600 transition-colors ml-1">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  초기화
                </Link>
              </div>
            )}

            {resources.length === 0 ? (
              <div className="text-center py-24">
                <span className="material-symbols-outlined text-[48px] text-slate-200 block mb-4">search_off</span>
                <p className="text-slate-400 font-bold">해당 조건의 리소스가 없습니다.</p>
                <Link href="/resources" className="inline-flex items-center gap-1.5 mt-4 text-sky-600 font-bold text-sm">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  전체 보기
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {resources.map(r => (
                  <div key={r.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md hover:border-sky-100 dark:hover:border-sky-800 transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[13px]">{TYPE_ICONS[r.type] ?? 'article'}</span>
                          {r.type}
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${DIFFICULTY_COLORS[r.difficulty] ?? 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                          {r.difficulty}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-[17px] mb-2 leading-snug">{r.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 grow line-clamp-3">{r.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                        <span className="text-xs font-bold">{r.reads >= 1000 ? `${(r.reads / 1000).toFixed(1)}k` : r.reads}</span>
                      </div>
                      {r.contentUrl ? (
                        <ResourceCard id={r.id} contentUrl={r.contentUrl} variant="card" />
                      ) : (
                        <span className="text-xs font-bold text-slate-300">준비 중</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
