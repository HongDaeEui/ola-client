import Link from 'next/link';

interface Experiment {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  difficulty?: string;
  metric: string;
  category: string;
  stack: string[];
  color?: string;
  likes: number;
  author?: { username: string };
}

async function getExperiments(category?: string): Promise<Experiment[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== '전체 레시피') params.set('category', category);
    const qs = params.toString();
    const res = await fetch(`https://ola-backend-psi.vercel.app/api/labs${qs ? `?${qs}` : ''}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch data');
    return await res.json();
  } catch (error) {
    console.error('API Fetch failed:', error);
    return [];
  }
}

const DIFFICULTY_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  '입문': { bg: 'bg-emerald-50', text: 'text-emerald-700', label: '🟢 입문' },
  '중급': { bg: 'bg-amber-50',   text: 'text-amber-700',   label: '🟡 중급' },
  '고급': { bg: 'bg-red-50',     text: 'text-red-700',     label: '🔴 고급' },
};

const CATEGORY_KEYWORDS: Record<string, string> = {
  '자동화': 'automation,robot',
  '개발': 'coding,developer',
  '크리에이티브': 'design,creative',
  '생산성': 'productivity,office',
};

const FILTERS = ['전체 레시피', '자동화', '개발', '크리에이티브', '생산성'];

export default async function LabsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeFilter = category ?? '전체 레시피';
  const experiments = await getExperiments(activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header (생략됨) */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16 bg-white dark:bg-slate-900 p-10 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <span className="material-symbols-outlined text-[16px]">science</span>
              Ola Exclusive
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
              AI 실험실 <span className="text-sky-600 dark:text-sky-400">Labs</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
              AI 도구를 조합하면 어떤 마법이 일어날까요?{' '}
              <br className="hidden md:block" />
              직접 부딪혀보고 증명된 최고의 실전 레시피들을 만나보세요.
            </p>
          </div>
          <div className="flex-shrink-0 w-full lg:w-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <Link href="/community/write"
              className="relative w-full lg:w-auto bg-slate-900 dark:bg-slate-800 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-2xl flex items-center justify-center gap-3">
              내 실험 결과 공유하기
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {FILTERS.map((f) => (
              <Link key={f}
                href={f === '전체 레시피' ? '/labs' : `/labs?category=${encodeURIComponent(f)}`}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeFilter === f
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-200 dark:shadow-none'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700'
                }`}>
                {f}
              </Link>
            ))}
          </div>
          <span className="text-sm font-bold text-slate-400">{experiments.length}개의 레시피</span>
        </div>

        {/* Grid */}
        {experiments.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-[48px] text-slate-200 dark:text-slate-700 block mb-4">science</span>
            <p className="text-slate-400 font-bold">해당 카테고리의 실험이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {experiments.map((exp) => {
              const diff = exp.difficulty ? DIFFICULTY_STYLE[exp.difficulty] : null;
              const imgKeywords = CATEGORY_KEYWORDS[exp.category] || 'technology,ai';
              const seed = parseInt((exp.id || '1').split('-')[0], 16) % 10000 || exp.likes || 1;
              
              return (
                <Link key={exp.id} href={`/labs/${exp.id}`}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-sky-900/20 hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-300 h-full">

                  {/* Banner */}
                  <div className={`h-48 relative p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${
                    [
                      'from-sky-500 to-indigo-600',
                      'from-rose-500 to-fuchsia-600',
                      'from-emerald-400 to-teal-600',
                      'from-amber-400 to-orange-500',
                      'from-violet-500 to-purple-700',
                      'from-pink-500 to-rose-500'
                    ][seed % 6]
                  } group-hover:shadow-[inset_0_0_80px_rgba(0,0,0,0.3)] transition-shadow duration-700`}>
                    {/* Dynamic AI Abstract Illustration via DiceBear */}
                    <img 
                      src={`https://api.dicebear.com/9.x/shapes/svg?seed=${exp.title}&backgroundColor=transparent`} 
                      alt={exp.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {exp.category}
                      </span>
                      {diff && (
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${diff.bg} ${diff.text}`}>
                          {diff.label}
                        </span>
                      )}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-white text-xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                        {exp.emoji && <span className="mr-2">{exp.emoji}</span>}
                        {exp.title}
                      </h3>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed mb-6 flex-1">{exp.description}</p>

                    <div className="mb-6">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Tech Stack Used</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.stack.map((tool: string, j: number) => (
                          <span key={j} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-sky-400 dark:bg-sky-500" />
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl p-4 mb-6 border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
                      <span className="material-symbols-outlined font-light">bolt</span>
                      <span className="font-extrabold text-sm">{exp.metric}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-400 dark:text-slate-300 text-xs font-bold uppercase">
                          {exp.author?.username?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">@{exp.author?.username || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-sm font-bold">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        {exp.likes.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
