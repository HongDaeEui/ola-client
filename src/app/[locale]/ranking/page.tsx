import { API_BASE, apiFetch } from '@/lib/api';
import Image from "next/image";
import { Link } from '@/i18n/routing';
export const revalidate = 300;


type RankedTool = {
  id: string; name: string; shortDesc: string; category: string;
  rating: number; pricingModel?: string; iconUrl?: string; isFeatured: boolean;
};
type RankedPost = {
  id: string; title: string; category: string; likes: number; views: number;
  createdAt: string; author: { username: string };
};
type RankedLab = {
  id: string; title: string; category: string; emoji?: string; difficulty?: string; likes: number;
};

async function getToolRanking(): Promise<RankedTool[]> {
  try {
    const res = await apiFetch(`${API_BASE}/tools/ranking`, { next: { revalidate: 300 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}
async function getPostRanking(): Promise<RankedPost[]> {
  try {
    const res = await apiFetch(`${API_BASE}/posts/ranking`, { next: { revalidate: 300 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}
async function getLabRanking(): Promise<RankedLab[]> {
  try {
    const res = await apiFetch(`${API_BASE}/labs`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const all: RankedLab[] = await res.json();
    return all.slice(0, 10);
  } catch { return []; }
}

const DIFFICULTY_COLOR: Record<string, string> = {
  입문: 'bg-emerald-100 text-emerald-700',
  중급: 'bg-amber-100 text-amber-700',
  고급: 'bg-red-100 text-red-700',
};
const PRICING_COLOR: Record<string, string> = {
  Free: 'bg-emerald-50 text-emerald-600',
  Freemium: 'bg-sky-50 text-sky-600',
  'Free Trial': 'bg-violet-50 text-violet-600',
  Paid: 'bg-slate-100 text-slate-500',
};

export default async function RankingPage({ params }: { params: Promise<{ locale: string }> }) {
  const [tools, posts, labs] = await Promise.all([getToolRanking(), getPostRanking(), getLabRanking()]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-5xl mx-auto px-6">

        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[40px] p-10 text-center text-white mb-12 shadow-2xl shadow-indigo-100">
          <div className="inline-block bg-sky-500/20 text-sky-300 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-sky-500/30">실시간 인기 랭킹</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tighter">Ola 인기 TOP 10</h1>
          <p className="text-indigo-200 opacity-80 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
            사용자 활동량, 평점, 조회수를 종합해 선정된<br />실시간 인기 AI 도구 · 커뮤니티 · 실험실 랭킹입니다.
          </p>
        </div>

        {/* Tools */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-sky-500 text-2xl">extension</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">도구 TOP 10</h2>
            <span className="text-xs text-slate-400 font-medium ml-auto">평점 기준</span>
          </div>
          <div className="space-y-2">
            {tools.map((tool, i) => (
              <Link key={tool.id} href={`/tools/${tool.id}`}
                className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-lg hover:shadow-sky-50 transition-all group">
                <div className={`w-10 flex items-center justify-center font-black text-xl italic shrink-0 ${i < 3 ? 'text-sky-600' : 'text-slate-300'}`}>{i + 1}</div>
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-sm group-hover:bg-slate-900 group-hover:text-white transition-colors overflow-hidden">
                  {tool.iconUrl ? <Image src={tool.iconUrl} alt={tool.name} width={24} height={24} className="w-full h-full object-cover" /> : tool.name.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 truncate">{tool.name}</p>
                    {tool.isFeatured && <span className="text-[10px] bg-sky-500 text-white px-1.5 py-0.5 rounded font-black uppercase shrink-0">Featured</span>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{tool.shortDesc}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRICING_COLOR[tool.pricingModel ?? ''] ?? 'bg-slate-100 text-slate-500'}`}>
                    {tool.pricingModel ?? 'Free'}
                  </span>
                  <div className="flex items-center gap-0.5 text-sm font-black text-amber-500 w-12 justify-end">
                    <span className="material-symbols-outlined text-base">star</span>{tool.rating.toFixed(1)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {tools.length === 0 && <p className="text-center text-slate-400 py-10">아직 데이터가 없어요</p>}
        </section>

        {/* Community */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-rose-500 text-2xl">local_fire_department</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">커뮤니티 인기글 TOP 10</h2>
            <span className="text-xs text-slate-400 font-medium ml-auto">조회수 기준</span>
          </div>
          <div className="space-y-2">
            {posts.map((post, i) => (
              <Link key={post.id} href={`/community/${post.id}`}
                className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 hover:border-rose-200 dark:hover:border-rose-700 hover:shadow-lg hover:shadow-rose-50 transition-all group">
                <div className={`w-10 text-center font-black text-xl italic shrink-0 ${i < 3 ? 'text-rose-500' : 'text-slate-300'}`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-rose-600 truncate">{post.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{post.category} · {post.author.username} · {new Date(post.createdAt).toLocaleDateString('ko-KR')}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 shrink-0">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">visibility</span>{post.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">favorite</span>{post.likes.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
          {posts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-400">아직 인기 게시글이 없어요</p>
              <Link href="/community/write" className="mt-3 inline-block text-sky-600 font-bold text-sm hover:underline">첫 글을 작성해보세요 →</Link>
            </div>
          )}
        </section>

        {/* Labs */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-purple-500 text-2xl">science</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">AI 실험실 인기 TOP 10</h2>
            <span className="text-xs text-slate-400 font-medium ml-auto">좋아요 기준</span>
          </div>
          <div className="space-y-2">
            {labs.map((lab, i) => (
              <Link key={lab.id} href={`/labs/${lab.id}`}
                className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-lg hover:shadow-purple-50 transition-all group">
                <div className={`w-10 text-center font-black text-xl italic shrink-0 ${i < 3 ? 'text-purple-500' : 'text-slate-300'}`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 truncate">
                    {lab.emoji && <span className="mr-1.5">{lab.emoji}</span>}{lab.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lab.category}</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  {lab.difficulty && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[lab.difficulty] ?? 'bg-slate-100 text-slate-500'}`}>{lab.difficulty}</span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-base">favorite</span>{lab.likes}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {labs.length === 0 && <p className="text-center text-slate-400 py-10">아직 데이터가 없어요</p>}
        </section>

      </div>
    </div>
  );
}
