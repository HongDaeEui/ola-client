export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 font-['Noto_Sans_KR']">
      <div className="max-w-[1400px] mx-auto">
        {/* Header skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 animate-pulse"
            >
              <div className="flex gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
