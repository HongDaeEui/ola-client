"use client";
import { useEffect } from 'react';

export default function CommunityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 실제 운영 환경 콘솔에 에러 원인 로깅
    console.error("Community Page SSR Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">커뮤니티 데이터를 불러오는 중 문제가 발생했습니다.</h2>
      <p className="text-sm text-slate-500 mb-2">Error Digest: {error.digest}</p>
      <div className="text-sm text-rose-500 mb-8 bg-rose-50 p-4 rounded-xl border border-rose-100 max-w-lg break-words text-left">
        <strong>Error Message:</strong> {error.message || "서버 컴포넌트 렌더링 오류가 발생했습니다."}
      </div>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700"
      >
        다시 시도하기
      </button>
    </div>
  );
}
