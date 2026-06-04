'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';

const SHOW_DEFAULT = 10;

function buildMultiSelectHref(currentStr: string, key: string, value: string) {
  const p = new URLSearchParams(currentStr);
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

export default function CategorySidebar({
  categories,
  activeCategories,
  currentParams,
}: {
  categories: string[];
  activeCategories: string[];
  currentParams: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? categories : categories.slice(0, SHOW_DEFAULT);
  const hidden = categories.length - SHOW_DEFAULT;

  return (
    <div className="mb-6">
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">카테고리</p>
      <div className="space-y-1">
        {visible.map(cat => {
          const isActive = activeCategories.includes(cat);
          return (
            <Link
              key={cat}
              prefetch={false}
              href={buildMultiSelectHref(currentParams, 'category', cat)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isActive ? 'border-sky-500 bg-sky-500' : 'border-slate-300 dark:border-slate-600'}`}>
                {isActive && <span className="material-symbols-outlined text-white text-[12px]">check</span>}
              </span>
              <span className="truncate">{cat}</span>
            </Link>
          );
        })}
      </div>

      {categories.length > SHOW_DEFAULT && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-2 w-full text-xs text-slate-500 hover:text-sky-600 font-medium flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
          {expanded ? '접기' : `${hidden}개 더 보기`}
        </button>
      )}
    </div>
  );
}
