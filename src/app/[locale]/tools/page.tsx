import { API_BASE, apiFetch } from '@/lib/api';
import { Link } from '@/i18n/routing';
import { getLogoUrl } from '@/lib/logo';
export const revalidate = 300;


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
    const res = await apiFetch(`${API_BASE}/tools${qs ? `?${qs}` : ''}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getCategories(): Promise<string[]> {
  try {
    const res = await apiFetch(`${API_BASE}/tools/categories`, { next: { revalidate: 300 } });
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
          <aside className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 sticky top-28">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-500">filter_list</span>
                필터
              </h3>
              {hasFilters && (
                <Link href="/tools" className="text-xs text-sky-600 font-bold hover:underline">
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
                      href={buildMultiSelectHref(currentParams, 'pricing', p)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${isActive ? 'border-sky-500 bg-sky-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        {isActive && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
                      </span>
                      {p}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">카테고리</p>
              <div className="space-y-1">
                {categories.map(cat => {
                  const isActive = activeCategories.includes(cat);
                  return (
                    <Link
                      key={cat}
                      href={buildMultiSelectHref(currentParams, 'category', cat)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${isActive ? 'border-sky-500 bg-sky-500' : 'border-slate-300'}`}>
                        {isActive && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
                      </span>
                      <span className="truncate">{cat}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">인기 태그</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map(tag => {
                  const isActive = activeTags.includes(tag);
                  return (
                    <Link
                      key={tag}
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
                      <Link href={buildMultiSelectHref(currentParams, 'category', c)} className="ml-0.5 hover:text-slate-900 dark:hover:text-white">×</Link>
                    </span>
                  ))}
                  {activePricings.map(p => (
                    <span key={p} className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 text-xs font-bold px-2 py-1 rounded-full border border-sky-100 dark:border-sky-800">
                      {p}
                      <Link href={buildMultiSelectHref(currentParams, 'pricing', p)} className="ml-0.5 hover:text-sky-900 dark:hover:text-sky-200">×</Link>
                    </span>
                  ))}
                  {activeTags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-xs font-bold px-2 py-1 rounded-full border border-violet-100 dark:border-violet-800">
                      {t}
                      <Link href={buildMultiSelectHref(currentParams, 'tags', t)} className="ml-0.5 hover:text-violet-900 dark:hover:text-violet-200">×</Link>
                    </span>
                  ))}
                  
                  <p className="text-slate-500 text-sm ml-1">
                    총 <span className="font-bold text-slate-700 dark:text-slate-300">{toolsList.length}</span>개 도구
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                {SORT_OPTIONS.map(opt => (
                  <Link
                    key={opt.value}
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

            {/* Grid */}
            {toolsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {toolsList.map((tool) => (
                  <Link key={tool.id} href={`/tools/${tool.id}`}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-sky-300 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="flex gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-lg uppercase tracking-tighter border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 overflow-hidden">
                        {getLogoUrl(tool.iconUrl)
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={getLogoUrl(tool.iconUrl)} alt={tool.name} width={56} height={56} className="w-full h-full object-contain p-1" />
                          : tool.name.substring(0, 2)
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors truncate">{tool.name}</h3>
                          {tool.isFeatured && (
                            <span className="text-[10px] bg-sky-500 text-white px-1.5 py-0.5 rounded font-black uppercase flex-shrink-0">Featured</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${PRICING_COLOR[tool.pricingModel] ?? 'bg-slate-100 text-slate-600'}`}>
                            {tool.pricingModel ?? 'Free'}
                          </span>
                          <div className="flex items-center text-[11px] text-slate-500 font-bold">
                            <span className="material-symbols-outlined text-[12px] text-amber-400 mr-0.5">star</span>
                            {tool.rating?.toFixed(1) ?? '—'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 truncate">{tool.shortDesc}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{tool.description}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t border-slate-50 dark:border-slate-700">
                      <span className="text-[10px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {tool.category}
                      </span>
                      {(tool.tags ?? []).slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-slate-200">search_off</span>
                <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">해당 조건의 도구가 없어요</p>
                <Link href="/tools" className="mt-4 inline-block text-sky-600 font-bold text-sm hover:underline">
                  필터 초기화 →
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
