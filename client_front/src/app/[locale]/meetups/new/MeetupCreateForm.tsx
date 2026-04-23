"use client";

import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { FormEvent, useState } from 'react';
import { Link } from '@/i18n/routing';

export default function MeetupCreateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Auto-fill from query params if coming from a Lab
  const refLabId = searchParams.get('referenceLabId');
  const refTitle = searchParams.get('refTitle');
  const refEmoji = searchParams.get('refEmoji');

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: refTitle ? `[스터디] ${refEmoji ? refEmoji + ' ' : ''}${refTitle} 정복하기` : '',
    description: refTitle ? `이번 모임에서는 '${refTitle}' 튜토리얼을 기반으로 다 같이 실습하고 결과물을 공유합니다!\n\n미리 튜토리얼을 한 번 읽어오시면 좋습니다.` : '',
    date: '',
    location: '',
    isVirtual: 'true',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // UI 모의 전송 지연
    await new Promise(r => setTimeout(r, 1200));
    
    // 실제 백엔드 연동 전이므로 알림창만 띄우고 이동
    alert('모임 개설이 완료되었습니다! (UI 목업)');
    router.push('/meetups');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {refLabId && (
        <div className="bg-violet-50 border border-violet-100 p-5 rounded-2xl flex gap-4 items-start mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 rounded-xl bg-violet-200 text-violet-700 flex items-center justify-center font-black flex-shrink-0">
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
          onChange={e => setFormData({...formData, title: e.target.value})}
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
          onChange={e => setFormData({...formData, description: e.target.value})}
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
            onChange={e => setFormData({...formData, date: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2">진행 방식 <span className="text-rose-500">*</span></label>
          <select 
            value={formData.isVirtual}
            onChange={e => setFormData({...formData, isVirtual: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all appearance-none"
          >
            <option value="true">온라인 (Zoom / Google Meet)</option>
            <option value="false">오프라인</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-black text-slate-700 mb-2">모임 장소 / 링크 <span className="text-rose-500">*</span></label>
        <input 
          required
          type="text" 
          value={formData.location}
          onChange={e => setFormData({...formData, location: e.target.value})}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400"
          placeholder={formData.isVirtual === 'true' ? "화상회의 접속 링크를 입력하세요." : "정확한 오프라인 장소나 카페 이름을 입력하세요."}
        />
      </div>

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
            <>개설 완료하기</>
          )}
        </button>
      </div>
    </form>
  );
}
