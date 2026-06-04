'use client';

import { useState, useMemo, useTransition } from 'react';
import { Link } from '@/i18n/routing';

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

const PRICING_COLOR: Record<string, string> = {
  Free: 'bg-emerald-50 text-emerald-600',
  Freemium: 'bg-sky-50 text-sky-600',
  'Free Trial': 'bg-violet-50 text-violet-600',
  Paid: 'bg-slate-100 text-slate-500',
};

function getLogoUrl(iconUrl?: string | null): string | undefined {
  if (!iconUrl) return undefined;
  const m = iconUrl.match(/logo\.clearbit\.com\/([^?#]+)/);
  if (m) return `https://img.logo.dev/${m[1]}?token=pk_HqFdbQC2T_GqjA12c910QQ`;
  if (iconUrl.includes('img.logo.dev')) return iconUrl;
  return iconUrl;
}

export default function ToolsClientFilter({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState('');
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (!query.trim()) return tools;
    const q = query.toLowerCase();
    return tools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.shortDesc?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q) ||
      t.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  }, [tools, query]);

  return (
    <div className="flex-1 min-w-0">
      {/* Search box */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
        <input
          type="text"
          value={query}
          onChange={e => startTransition(() => setQuery(e.target.value))}
          placeholder="도구 이름, 설명, 태그 검색..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500 mb-4">
        {query
          ? <><span className="font-bold text-slate-700 dark:text-slate-300">{filtered.length}</span>개 검색됨 (전체 {tools.length}개)</>
          : <>총 <span className="font-bold text-slate-700 dark:text-slate-300">{tools.length}</span>개 도구</>
        }
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(tool => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              prefetch={false}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-sky-300 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center text-slate-500 font-bold text-lg uppercase tracking-tighter border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 overflow-hidden">
                  {getLogoUrl(tool.iconUrl)
                    ? <img src={getLogoUrl(tool.iconUrl)} alt={tool.name} width={56} height={56} className="w-full h-full object-contain p-1" />
                    : tool.name.substring(0, 2)
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors truncate">{tool.name}</h3>
                    {tool.isFeatured && (
                      <span className="text-[10px] bg-sky-500 text-white px-1.5 py-0.5 rounded font-black uppercase shrink-0">Featured</span>
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
                <span className="text-[10px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded">{tool.category}</span>
                {(tool.tags ?? []).slice(0, 2).map(t => (
                  <span key={t} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">#{t}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-slate-200">search_off</span>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
            {query ? `"${query}"에 해당하는 도구가 없어요` : '해당 조건의 도구가 없어요'}
          </p>
          {query ? (
            <button onClick={() => setQuery('')} className="mt-4 inline-block text-sky-600 font-bold text-sm hover:underline">
              검색어 지우기 →
            </button>
          ) : (
            <Link href="/tools" prefetch={false} className="mt-4 inline-block text-sky-600 font-bold text-sm hover:underline">
              필터 초기화 →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
