import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://ola-backend-psi.vercel.app/api';

type CategoryCount = { category: string; count: number };

async function getCategoryCounts(): Promise<CategoryCount[]> {
  try {
    const res = await fetch(`${API}/tools/categories`, { next: { revalidate: 300 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  '노코드 에이전트 · 업무 자동화': { icon: 'robot_2', color: 'from-sky-400 to-blue-600' },
  '에이전트 빌더 · 워크플로': { icon: 'account_tree', color: 'from-emerald-400 to-teal-600' },
  '코딩 / 개발 도구': { icon: 'code', color: 'from-indigo-400 to-purple-600' },
  '엔터프라이즈 에이전트 플랫폼': { icon: 'business', color: 'from-slate-700 to-slate-900' },
  'AI 브라우저 · 생산성': { icon: 'public', color: 'from-yellow-400 to-orange-500' },
  'AI 브라우저 · 리서치': { icon: 'manage_search', color: 'from-cyan-400 to-sky-600' },
  '데스크톱 에이전트 · 생산성': { icon: 'desktop_mac', color: 'from-slate-500 to-slate-700' },
  '고객지원 에이전트 · 음성 AI': { icon: 'support_agent', color: 'from-pink-500 to-rose-600' },
  'CRM · 프로그램 관리 · 분석': { icon: 'monitoring', color: 'from-emerald-500 to-teal-700' },
  '에이전트 앱 마켓 · 생산성': { icon: 'storefront', color: 'from-amber-400 to-orange-500' },
  '버티컬(펫케어) 에이전트': { icon: 'pets', color: 'from-amber-500 to-orange-600' },
  '에이전트 플랫폼 · 개발자 도구': { icon: 'terminal', color: 'from-blue-600 to-indigo-800' },
  '개발자 도구 · Q&A': { icon: 'forum', color: 'from-indigo-500 to-violet-600' },
  '클라우드 AI 플랫폼 · 에이전트': { icon: 'cloud', color: 'from-sky-400 to-blue-600' },
  '스타트업 전략 · 생산성': { icon: 'rocket_launch', color: 'from-rose-400 to-pink-600' },
  '범용 LLM · 에이전트용 모델': { icon: 'memory', color: 'from-violet-400 to-fuchsia-600' },
  '업무용 코파일럿 · 에이전트': { icon: 'work', color: 'from-slate-600 to-slate-800' },
  '에이전트 · 자동화 모델 (API)': { icon: 'api', color: 'from-sky-500 to-indigo-600' },
  '오피스 / 연구': { icon: 'article', color: 'from-slate-600 to-slate-800' },
  '이미지 / 디자인': { icon: 'palette', color: 'from-orange-400 to-amber-600' },
  '텍스트 / 글쓰기': { icon: 'history_edu', color: 'from-emerald-400 to-teal-600' },
  '오디오 / 음악': { icon: 'music_note', color: 'from-violet-400 to-fuchsia-600' },
  '영상 생성': { icon: 'movie', color: 'from-rose-400 to-pink-600' },
  '이미지 · 영상 생성 · 마케팅': { icon: 'campaign', color: 'from-fuchsia-500 to-purple-600' },
};

const DEFAULT_META = { icon: 'science', color: 'from-red-400 to-orange-600' };

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();

  return (
    <div className="min-h-screen bg-white pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">AI 도구 카테고리 탐색</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            당신의 일상과 비즈니스를 혁신할 최고의 AI를 <br className="hidden md:block" />
            카테고리별로 쉽고 빠르게 찾아보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {counts.map((cat) => {
            const meta = CATEGORY_META[cat.category] ?? DEFAULT_META;
            return (
              <Link
                key={cat.category}
                href={`/tools?category=${encodeURIComponent(cat.category)}`}
                className="group relative bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-sky-300 hover:bg-white hover:shadow-2xl hover:shadow-sky-100 transition-all overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${meta.color} opacity-[0.03] group-hover:opacity-10 transition-opacity rounded-bl-[100px]`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-3xl font-light">{meta.icon}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors tracking-tight">
                  {cat.category}
                </h3>
                <div className="flex items-center justify-between mt-6">
                  <p className="text-slate-500 text-sm font-bold">
                    <span className="text-sky-600 font-extrabold">{cat.count}</span>개의 도구
                  </p>
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {counts.length === 0 && (
          <p className="text-center text-slate-400 py-20">카테고리 데이터를 불러오는 중입니다...</p>
        )}

        <div className="mt-24 text-center bg-slate-50 rounded-[40px] p-12 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">직접 만든 AI 도구가 있나요?</h2>
          <p className="text-slate-500 mb-8">Ola 커뮤니티에 당신의 프로젝트를 공유하고 피드백을 받아보세요.</p>
          <Link href="/submit" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            새로운 도구 등록하기
          </Link>
        </div>

      </div>
    </div>
  );
}
