import { API_BASE } from '@/lib/api';
import Link from 'next/link';
import PromptShareButton from './PromptShareButton';
import { PromptFeed, type Prompt } from '@/components/PromptFeed';

const LIMIT = 12;

const CATEGORIES = ['이미지', '텍스트', '코딩', '비디오', '에이전트', '음악'];

async function getPrompts(category?: string): Promise<Prompt[]> {
  try {
    const qs = new URLSearchParams({ page: '1', limit: String(LIMIT) });
    if (category) qs.set('category', category);
    const res = await fetch(`${API_BASE}/prompts?${qs}`, { next: { revalidate: 60 } });
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tighter mb-4">프롬프트 라이브러리</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
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
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-sky-300'
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
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-sky-300'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Prompt Feed with infinite scroll */}
        <PromptFeed key={category ?? 'all'} initialPrompts={prompts} category={category ?? ''} />

      </div>
    </div>
  );
}
