"use client";

import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { FormEvent, useState } from 'react';
import { Link } from '@/i18n/routing';
import { API_BASE } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function MeetupCreateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  const refLabId = searchParams.get('referenceLabId');
  const refTitle = searchParams.get('refTitle');
  const refEmoji = searchParams.get('refEmoji');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: refTitle ? `[스터디] ${refEmoji ? refEmoji + ' ' : ''}${refTitle} 정복하기` : '',
    description: refTitle
      ? `이번 모임에서는 '${refTitle}' 튜토리얼을 기반으로 다 같이 실습하고 결과물을 공유합니다!\n\n미리 튜토리얼을 한 번 읽어오시면 좋습니다.`
      : '',
    date: '',
    location: '',
    isVirtual: 'true',
    maxParticipants: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // getSession()은 캐시된 토큰을 반환하므로 만료됐을 수 있음 — refreshSession()으로 갱신
      let { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const refreshed = await supabase.auth.refreshSession();
        if (refreshed.data.session) session = refreshed.data.session;
      }
      const token = session?.access_token;
      if (!token) {
        setError('인증 정보를 가져올 수 없습니다. 다시 로그인해 주세요.');
        return;
      }

      const res = await fetch(`${API_BASE}/meetups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          location: formData.location,
          isVirtual: formData.isVirtual === 'true',
          referenceLabId: refLabId ?? undefined,
          maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? '모임 생성에 실패했습니다. 다시 시도해 주세요.');
        return;
      }

      router.push('/meetups');
    } catch {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16 space-y-4">
        <span className="material-symbols-outlined text-[48px] text-slate-300 block">lock</span>
        <h2 className="text-xl font-extrabold text-slate-800">로그인이 필요해요</h2>
        <p className="text-slate-500 text-sm">모임을 개설하려면 먼저 로그인해 주세요.</p>
        <button
          onClick={signInWithGoogle}
          className="mt-4 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          Google로 로그인
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {refLabId && (
        <div className="bg-violet-50 border border-violet-100 p-5 rounded-2xl flex gap-4 items-start mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 rounded-xl bg-violet-200 text-violet-700 flex items-center justify-center font-black shrink-0">
            {refEmoji || '📚'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-violet-600 bg-violet-200/50 px-2.5 py-1 rounded-md tracking-wider uppercase">지정 교재 연동됨</span>
            </div>
            <p className="font-bold text-slate-800">
              <Link href={`/labs/${refLabId}`} target="_blank" className="hover:text-violet-600 hover:underline transition-colors">
                {refTitle}
              </Link>
            </p>
            <p className="text-xs text-slate-500 mt-1">이 모임은 위 실험실 튜토리얼을 기반으로 자동 설정되었습니다.</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-black text-slate-700 mb-2">모임 제목 <span className="text-rose-500">*</span></label>
        <input
          required
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400"
          placeholder="예: 주말 AI 이미지 프롬프트 스터디"
        />
      </div>

      <div>
        <label className="block text-sm font-black text-slate-700 mb-2">모임 설명 <span className="text-rose-500">*</span></label>
        <textarea
          required
          rows={5}
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400 resize-none leading-relaxed"
          placeholder="어떤 모임인지, 참석자는 무엇을 준비해야 하는지 적어주세요."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2">모임 일시 <span className="text-rose-500">*</span></label>
          <input
            required
            type="datetime-local"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-black text-slate-700 mb-2">진행 방식 <span className="text-rose-500">*</span></label>
          <select
            value={formData.isVirtual}
            onChange={e => setFormData({ ...formData, isVirtual: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all appearance-none"
          >
            <option value="true">온라인 (Zoom / Google Meet)</option>
            <option value="false">오프라인</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2">
            모임 장소 / 링크 <span className="text-rose-500">*</span>
          </label>
          <input
            required
            type="text"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400"
            placeholder={formData.isVirtual === 'true' ? '화상회의 접속 링크를 입력하세요.' : '오프라인 장소나 카페 이름을 입력하세요.'}
          />
        </div>

        <div>
          <label className="block text-sm font-black text-slate-700 mb-2">최대 참가 인원 <span className="text-slate-400 font-medium">(선택)</span></label>
          <input
            type="number"
            min="2"
            max="500"
            value={formData.maxParticipants}
            onChange={e => setFormData({ ...formData, maxParticipants: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400"
            placeholder="예: 20"
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in duration-300">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      <div className="pt-6 border-t border-slate-100 flex gap-4 justify-end">
        <Link
          href="/meetups"
          className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              생성 중...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">groups</span>
              모임 개설하기
            </>
          )}
        </button>
      </div>
    </form>
  );
}
