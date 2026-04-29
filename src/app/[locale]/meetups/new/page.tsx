import { Suspense } from 'react';
import MeetupCreateForm from './MeetupCreateForm';

export const metadata = {
  title: '새 모임 개설하기 | Ola',
};

export default function NewMeetupPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-['Noto_Sans_KR'] pt-32 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">groups</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">새 스터디 모임 개설하기</h1>
          <p className="text-slate-500 mt-2">커뮤니티 멤버들과 함께 튜토리얼을 실습하고 토론해보세요.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xl shadow-slate-200/40">
          <Suspense fallback={<div className="text-center py-20 text-slate-400 font-medium animate-pulse">폼을 불러오는 중입니다...</div>}>
            <MeetupCreateForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
