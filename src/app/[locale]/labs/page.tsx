import { Link } from '@/i18n/routing';
import Image from "next/image";
import { API_BASE, apiFetch } from '@/lib/api';
import { LikeBookmarkButtons } from '@/components/LikeBookmarkButtons';
export const revalidate = 300;

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
    const res = await apiFetch(`${API_BASE}/labs${qs ? `?${qs}` : ''}`, { next: { revalidate: 60 } });
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
          <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full">
            {experiments.map((exp) => {
              const diff = exp.difficulty ? DIFFICULTY_STYLE[exp.difficulty] : null;
              const seed = parseInt((exp.id || '1').split('-')[0], 16) % 10000 || exp.likes || 1;
              const bgGradient = [
                'from-sky-500 to-indigo-600',
                'from-rose-500 to-fuchsia-600',
                'from-emerald-400 to-teal-600',
                'from-amber-400 to-orange-500',
                'from-violet-500 to-purple-700',
                'from-pink-500 to-rose-500'
              ][seed % 6];
              
              return (
                <Link key={exp.id} href={`/labs/${exp.id}`}
                  className="group flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-sky-900/10 hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-300 p-3 sm:p-5 gap-5 items-center relative overflow-hidden">
                  
                  {/* Left: Thumbnail (Avatar format) */}
                  <div className={`w-full sm:w-28 h-32 sm:h-28 rounded-2xl shrink-0 overflow-hidden relative bg-gradient-to-br ${bgGradient} flex items-center justify-center shadow-inner`}>
                    <img 
                      src={`https://api.dicebear.com/9.x/shapes/svg?seed=${exp.title}&backgroundColor=transparent`} 
                      alt={exp.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="relative z-10 text-4xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                      {exp.emoji || '🔬'}
                    </div>
                  </div>

                  {/* Center: Contents */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{exp.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="text-[11px] font-bold text-slate-500">@{exp.author?.username || 'Unknown'}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white truncate mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {exp.title}
                    </h3>
                    
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mb-3 pr-4">
                      {exp.description}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {diff && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${diff.bg} ${diff.text}`}>
                          {diff.label}
                        </span>
                      )}
                      <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800/50">
                        <span className="material-symbols-outlined text-[12px]">bolt</span>
                        {exp.metric}
                      </span>
                      <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
                      <div className="flex gap-1.5 overflow-hidden">
                        {exp.stack.slice(0, 3).map((tool, j) => (
                          <span key={j} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md truncate max-w-[80px] shadow-sm">
                            {tool}
                          </span>
                        ))}
                        {exp.stack.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded-md">
                            +{exp.stack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Upvote Box */}
                  <div className="w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-5 flex justify-end sm:justify-center z-20">
                    <LikeBookmarkButtons 
                      targetType="LAB" 
                      targetId={exp.id} 
                      initialLikes={exp.likes} 
                      variant="product-hunt" 
                    />
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
