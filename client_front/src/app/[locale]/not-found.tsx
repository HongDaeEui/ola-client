import { Link } from '@/i18n/routing';
export const revalidate = 300;

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 font-['Noto_Sans_KR']">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-black text-slate-200 dark:text-slate-800 mb-4 select-none">
          404
        </div>
        <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-sky-500 text-3xl">travel_explore</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
          페이지를 찾을 수 없어요
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          주소를 다시 확인해 주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-100 dark:shadow-none"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/tools"
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            도구 탐색하기
          </Link>
        </div>
      </div>
    </div>
  );
}
