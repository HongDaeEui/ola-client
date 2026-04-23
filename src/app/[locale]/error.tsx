'use client';
'use client';
'use client';

import { Link } from '@/i18n/routing';
export const revalidate = 300;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 font-['Noto_Sans_KR']">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-rose-500 text-4xl">error</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
          문제가 발생했어요
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
          페이지를 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg inline-block">
          {error.message || '알 수 없는 오류'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-100 dark:shadow-none"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
