import Link from 'next/link';
import CopyButton from './CopyButton';
import PromptShareButton from './PromptShareButton';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://ola-backend-psi.vercel.app/api';

const CATEGORIES = ['이미지', '텍스트', '코딩', '비디오', '에이전트', '음악'];

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  toolName: string;
  likes: number;
  views: number;
  author: { username: string; avatarUrl?: string };
}

async function getPrompts(category?: string): Promise<Prompt[]> {
  try {
    const qs = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API}/prompts${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const prompts = await getPrompts(category);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter mb-4">프롬프트 라이브러리</h1>
            <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
              AI의 성능을 200% 끌어올려 줄 검증된 프롬프트들을 탐색해 보세요. <br />
              복사 버튼을 눌러 바로 당신의 작업에 적용할 수 있습니다.
            </p>
          </div>
          <PromptShareButton />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <Link
            href="/prompts"
            className={`px-5 py-2 rounded-full text-sm font-bold border flex-shrink-0 transition-colors ${
              !category
                ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-100'
                : 'bg-white border-slate-200 text-slate-500 hover:border-sky-300'
            }`}
          >
            전체
          </Link>
          {CATEGORIES.map(c => (
            <Link
              key={c}
              href={category === c ? '/prompts' : `/prompts?category=${encodeURIComponent(c)}`}
              className={`px-5 py-2 rounded-full text-sm font-bold border flex-shrink-0 transition-colors ${
                category === c
                  ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-100'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-sky-300'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((p) => (
              <Link
                key={p.id}
                href={`/prompts/${p.id}`}
                className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-xl hover:shadow-sky-50 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-2.5 py-1 rounded border border-sky-100">
                      {p.toolName}
                    </span>
                    <span className="text-xs font-bold text-slate-400">#{p.category}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                    {p.title}
                  </h3>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative mb-4">
                    <p className="text-sm text-slate-600 font-mono italic leading-relaxed line-clamp-4">
                      {p.content}
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent rounded-2xl pointer-events-none" />
                    <CopyButton text={p.content} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase overflow-hidden">
                      {p.author?.username?.charAt(0) ?? '?'}
                    </div>
                    <span className="text-xs font-bold text-slate-500">@{p.author?.username ?? 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">thumb_up</span>
                      <span className="text-[10px] font-bold">{p.likes ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">visibility</span>
                      <span className="text-[10px] font-bold">{p.views ?? 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-200">search_off</span>
            <p className="mt-4 text-slate-500 font-medium">해당 카테고리의 프롬프트가 없어요.</p>
            <Link href="/prompts" className="mt-4 inline-block text-sky-600 font-bold text-sm hover:underline">
              전체 보기 →
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm font-medium mb-6">검증된 품질의 프롬프트가 매일 업데이트됩니다.</p>
          <p className="text-slate-500 text-sm">
            총 <span className="font-bold text-slate-700">{prompts.length}</span>개의 프롬프트
          </p>
        </div>

      </div>
    </div>
  );
}
