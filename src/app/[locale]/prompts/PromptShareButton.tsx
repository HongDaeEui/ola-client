'use client';

import { Link } from '@/i18n/routing';

export default function PromptShareButton() {
  return (
    <Link
      href="/prompts/write"
      className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-700 transition-all"
    >
      <span className="material-symbols-outlined text-[16px]">add</span>
      프롬프트 공유하기
    </Link>
  );
}
