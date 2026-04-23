'use client';
'use client';
'use client';
import { API_BASE } from '@/lib/api';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
export const revalidate = 300;

const ADMIN_EMAIL = 'admin@olalab.kr';

interface Tool {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  category: string;
  launchUrl: string;
  pricingModel: string;
  tags: string[];
  createdAt: string;
}

const PRICING_COLOR: Record<string, string> = {
  Free: 'bg-emerald-50 text-emerald-600',
  Freemium: 'bg-sky-50 text-sky-600',
  'Free Trial': 'bg-violet-50 text-violet-600',
  Paid: 'bg-slate-100 text-slate-500',
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, 'approve' | 'reject' | null>>({});
  const [done, setDone] = useState<Record<string, 'approved' | 'rejected'>>({});

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_BASE}/tools/pending`)
      .then(r => r.ok ? r.json() : [])
      .then(setTools)
      .finally(() => setFetching(false));
  }, [isAdmin]);

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActionLoading(prev => ({ ...prev, [id]: action }));
    try {
      await fetch(`${API_BASE}/tools/${id}/${action}`, { method: 'PATCH' });
      setDone(prev => ({ ...prev, [id]: action === 'approve' ? 'approved' : 'rejected' }));
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Noto_Sans_KR']">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300">lock</span>
          <p className="mt-4 text-slate-500 font-medium">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  const pending = tools.filter(t => !done[t.id]);
  const processed = tools.filter(t => done[t.id]);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">관리자 도구 승인</h1>
          <p className="text-slate-500">등록 신청된 AI 도구를 검토하고 승인 또는 거절하세요.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <p className="text-3xl font-extrabold text-slate-900">{tools.length}</p>
            <p className="text-sm text-slate-500 mt-1">전체 대기</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <p className="text-3xl font-extrabold text-emerald-500">{Object.values(done).filter(v => v === 'approved').length}</p>
            <p className="text-sm text-slate-500 mt-1">승인 완료</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <p className="text-3xl font-extrabold text-rose-500">{Object.values(done).filter(v => v === 'rejected').length}</p>
            <p className="text-sm text-slate-500 mt-1">거절 완료</p>
          </div>
        </div>

        {/* Pending tools */}
        {fetching ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
                <div className="h-5 bg-slate-100 rounded w-1/3 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : pending.length === 0 && processed.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-200">check_circle</span>
            <p className="mt-4 text-slate-500 font-medium">검토 대기 중인 도구가 없어요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map(tool => (
              <div key={tool.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-extrabold text-slate-900 text-lg">{tool.name}</h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${PRICING_COLOR[tool.pricingModel] ?? 'bg-slate-100 text-slate-600'}`}>
                        {tool.pricingModel ?? 'Free'}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1">{tool.shortDesc}</p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{tool.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(tool.tags ?? []).map(tag => (
                        <span key={tag} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={tool.launchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-xs text-sky-600 font-bold hover:underline"
                    >
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      {tool.launchUrl}
                    </a>
                    <p className="text-[11px] text-slate-400 mt-2">
                      등록일: {new Date(tool.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(tool.id, 'approve')}
                      disabled={!!actionLoading[tool.id]}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                      {actionLoading[tool.id] === 'approve' ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      )}
                      승인
                    </button>
                    <button
                      onClick={() => handleAction(tool.id, 'reject')}
                      disabled={!!actionLoading[tool.id]}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-rose-50 text-rose-500 border border-rose-200 text-sm font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                      {actionLoading[tool.id] === 'reject' ? (
                        <span className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      )}
                      거절
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Processed this session */}
            {processed.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">이번 세션 처리 완료</p>
                <div className="space-y-3">
                  {processed.map(tool => (
                    <div
                      key={tool.id}
                      className={`rounded-2xl border px-6 py-4 flex items-center justify-between ${
                        done[tool.id] === 'approved'
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-rose-50 border-rose-200'
                      }`}
                    >
                      <span className="font-bold text-slate-700">{tool.name}</span>
                      <span className={`text-sm font-extrabold flex items-center gap-1 ${done[tool.id] === 'approved' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {done[tool.id] === 'approved' ? 'check_circle' : 'cancel'}
                        </span>
                        {done[tool.id] === 'approved' ? '승인됨' : '거절됨'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
