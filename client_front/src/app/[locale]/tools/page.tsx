import { Metadata } from 'next';
import { API_BASE, apiFetch } from '@/lib/api';
import { Link } from '@/i18n/routing';
import AdUnit from '@/components/AdUnit';
import ToolsClientFilter from '@/components/ToolsClientFilter';
import CategorySidebar from '@/components/CategorySidebar';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'AI 도구 탐색 | Ola',
  description: '최신 AI 도구들을 평점, 카테고리별로 필터링하고 탐색하세요. 당당에게 꼭 맞는 AI 툴을 찾을 수 있습니다.',
};

interface Tool {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  category: string;
  pricingModel: string;
  rating: number;
  tags: string[];
  iconUrl?: string;
  isFeatured: boolean;
}

const PRICING_OPTIONS = ['Free', 'Freemium', 'Free Trial', 'Paid'];
const SORT_OPTIONS = [
  { value: '', label: '최신순' },
  { value: 'rating', label: '평점순' },
  { value: 'popular', label: '인기순' },
];
const POPULAR_TAGS = ['Mac', '오픈소스', '노코드', 'IDE', '생산성', 'CRM', 'Web', 'Creative', 'Bot'];

const PRICING_COLOR: Record<string, string> = {
  Free: 'bg-emerald-50 text-emerald-600',
  Freemium: 'bg-sky-50 text-sky-600',
  'Free Trial': 'bg-violet-50 text-violet-600',
  Paid: 'bg-slate-100 text-slate-500',
};

async function getTools(filters: { category?: string; pricing?: string; tags?: string; sort?: string }): Promise<Tool[]> {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.pricing) params.set('pricing', filters.pricing);
  if (filters.tags) params.set('tags', filters.tags);
  if (filters.sort) params.set('sort', filters.sort);
  const qs = params.toString();
  try {
    const res = await apiFetch(`${API_BASE}/tools${qs ? `?${qs}` : ''}`, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getCategories(): Promise<string[]> {
  try {
    const res = await apiFetch(`${API_BASE}/tools/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data: { category: string }[] = await res.json();
    return data.map(d => d.category);
  } catch { return []; }
}

function buildMultiSelectHref(current: URLSearchParams, key: string, value: string) {
  const p = new URLSearchParams(current);
  const existingStr = p.get(key);
  let existing = existingStr ? existingStr.split(',').filter(Boolean) : [];
  if (existing.includes(value)) {
    existing = existing.filter(v => v !== value);
  } else {
    existing.push(value);
  }
  if (existing.length > 0) {
    p.set(key, existing.join(','));
  } else {
    p.delete(key);
  }
  const s = p.toString();
  return `/tools${s ? `?${s}` : ''}`;
}

function buildSortHref(current: URLSearchParams, value: string) {
  const p = new URLSearchParams(current);
  if (value) p.set('sort', value);
  else p.delete('sort');
  const s = p.toString();
  return `/tools${s ? `?${s}` : ''}`;
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; pricing?: string; tags?: string; sort?: string }>;
}) {
  const filters = await searchParams;
  const [toolsList, categories] = await Promise.all([getTools(filters), getCategories()]);

  const currentParams = new URLSearchParams();
  if (filters.category) currentParams.set('category', filters.category);
  if (filters.pricing) currentParams.set('pricing', filters.pricing);
  if (filters.tags) currentParams.set('tags', filters.tags);
  if (filters.sort) currentParams.set('sort', filters.sort);

  const hasFilters = !!(filters.category || filters.pricing || filters.tags);
  const activePricings = filters.pricing ? filters.pricing.split(',') : [];
  const activeCategories = filters.category ? filters.category.split(',') : [];
  const activeTags = filters.tags ? filters.tags.split(',') : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 sticky top-28">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-500">filter_list</span>
                필터
              </h3>
              {hasFilters && (
                <Link href="/tools" prefetch={false} className="text-xs text-sky-600 font-bold hover:underline">
                  초기화
                </Link>
              )}
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">프라이싱</p>
              <div className="space-y-1">
                {PRICING_OPTIONS.map(p => {
                  const isActive = activePricings.includes(p);
                  return (
                    <Link
                      key={p}
                      prefetch={false}
                      href={buildMultiSelectHref(currentParams, 'pricing', p)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isActive ? 'border-sky-500 bg-sky-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        {isActive && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
                      </span>
                      {p}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Category - 클라이언트 컴포넌트로 접기/펼치기 */}
            <CategorySidebar
              categories={categories}
              activeCategories={activeCategories}
              currentParams={currentParams.toString()}
            />

            {/* Popular Tags */}
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">인기 태그</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map(tag => {
                  const isActive = activeTags.includes(tag);
                  return (
                    <Link
                      key={tag}
                      prefetch={false}
                      href={buildMultiSelectHref(currentParams, 'tags', tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tag}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {activeCategories.length === 1 ? activeCategories[0] : activeCategories.length > 1 ? `${activeCategories.length}개 카테고리 복합 탐색` : '모든 AI 도구 탐색'}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  {activeCategories.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                      <span className="max-w-[100px] truncate">{c}</span>
                      <Link href={buildMultiSelectHref(currentParams, 'category', c)} prefetch={false} className="ml-0.5 hover:text-slate-900 dark:hover:text-white">×</Link>
                    </span>
                  ))}
                  {activePricings.map(p => (
                    <span key={p} className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 text-xs font-bold px-2 py-1 rounded-full border border-sky-100 dark:border-sky-800">
                      {p}
                      <Link href={buildMultiSelectHref(currentParams, 'pricing', p)} prefetch={false} className="ml-0.5 hover:text-sky-900 dark:hover:text-sky-200">×</Link>
                    </span>
                  ))}
                  {activeTags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-xs font-bold px-2 py-1 rounded-full border border-violet-100 dark:border-violet-800">
                      {t}
                      <Link href={buildMultiSelectHref(currentParams, 'tags', t)} prefetch={false} className="ml-0.5 hover:text-violet-900 dark:hover:text-violet-200">×</Link>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                {SORT_OPTIONS.map(opt => (
                  <Link
                    key={opt.value}
                    prefetch={false}
                    href={buildSortHref(currentParams, opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      (filters.sort ?? '') === opt.value
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 클라이언트 사이드 검색 + 그리드 */}
            <ToolsClientFilter tools={toolsList} />
          </main>
        </div>
      </div>
    </div>
  );
}
