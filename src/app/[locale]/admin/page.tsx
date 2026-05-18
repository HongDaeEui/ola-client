'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE } from '@/lib/api';
import { createClient } from '@/lib/supabase/client';

const ADMIN_EMAIL = 'admin@olalab.kr';

const supabase = createClient();

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

const TOOL_CATEGORIES = [
  'AI 글쓰기',
  '이미지 생성',
  '코딩 도우미',
  '음성/오디오',
  '영상 편집',
  '데이터 분석',
  '업무 자동화',
  '챗봇',
  '기타',
] as const;

const PRICING_MODELS = ['Free', 'Freemium', 'Free Trial', 'Paid'] as const;

const LAB_CATEGORIES = [
  'AI 글쓰기',
  '이미지 생성',
  '코딩',
  '데이터',
  '업무 자동화',
  '기타',
] as const;

const LAB_DIFFICULTIES = ['입문', '중급', '고급'] as const;

const INPUT_CLASS =
  'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 transition-colors';
const LABEL_CLASS = 'block text-sm font-bold text-slate-700 mb-1.5';
const SUBMIT_CLASS =
  'w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50';

interface ToolForm {
  name: string;
  shortDesc: string;
  description: string;
  category: (typeof TOOL_CATEGORIES)[number];
  pricingModel: (typeof PRICING_MODELS)[number];
  launchUrl: string;
  affiliateUrl: string;
  iconUrl: string;
  tags: string;
  rating: string;
}

const EMPTY_TOOL_FORM: ToolForm = {
  name: '',
  shortDesc: '',
  description: '',
  category: 'AI 글쓰기',
  pricingModel: 'Free',
  launchUrl: '',
  affiliateUrl: '',
  iconUrl: '',
  tags: '',
  rating: '4.0',
};

interface LabForm {
  title: string;
  description: string;
  content: string;
  category: (typeof LAB_CATEGORIES)[number];
  difficulty: (typeof LAB_DIFFICULTIES)[number];
  emoji: string;
  metric: string;
  stack: string;
  color: string;
}

const EMPTY_LAB_FORM: LabForm = {
  title: '',
  description: '',
  content: '',
  category: 'AI 글쓰기',
  difficulty: '입문',
  emoji: '',
  metric: '',
  stack: '',
  color: '',
};

async function getAccessToken(): Promise<string | null> {
  // getSession()은 캐시된 토큰을 반환하므로 만료됐을 수 있음 — refreshSession()으로 갱신
  let { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const refreshed = await supabase.auth.refreshSession();
    if (refreshed.data.session) session = refreshed.data.session;
  }
  return session?.access_token ?? null;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<'approve' | 'tool' | 'lab'>('approve');

  const [tools, setTools] = useState<Tool[]>([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, 'approve' | 'reject' | null>>({});
  const [done, setDone] = useState<Record<string, 'approved' | 'rejected'>>({});

  // 도구 추가 폼 상태
  const [toolForm, setToolForm] = useState<ToolForm>(EMPTY_TOOL_FORM);
  const [toolSubmitting, setToolSubmitting] = useState(false);
  const [toolSuccess, setToolSuccess] = useState('');
  const [toolError, setToolError] = useState('');

  // 실험실 추가 폼 상태
  const [labForm, setLabForm] = useState<LabForm>(EMPTY_LAB_FORM);
  const [labSubmitting, setLabSubmitting] = useState(false);
  const [labSuccess, setLabSuccess] = useState('');
  const [labError, setLabError] = useState('');

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    fetch('/api/admin/tools/pending', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(setTools)
      .finally(() => setFetching(false));
  }, [isAdmin]);

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActionLoading(prev => ({ ...prev, [id]: action }));
    try {
      await fetch(`/api/admin/tools/${id}/${action}`, { method: 'PATCH' });
      setDone(prev => ({ ...prev, [id]: action === 'approve' ? 'approved' : 'rejected' }));
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  }

  async function handleToolSubmit() {
    setToolError('');
    setToolSuccess('');
    setToolSubmitting(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setToolError('인증 정보를 가져올 수 없습니다. 다시 로그인해 주세요.');
        return;
      }

      const tagsArray = toolForm.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const ratingNum = toolForm.rating ? Number(toolForm.rating) : 4.0;

      const body: Record<string, unknown> = {
        name: toolForm.name,
        shortDesc: toolForm.shortDesc,
        description: toolForm.description,
        category: toolForm.category,
        pricingModel: toolForm.pricingModel,
        launchUrl: toolForm.launchUrl,
        tags: tagsArray,
        rating: Number.isFinite(ratingNum) ? ratingNum : 4.0,
      };
      if (toolForm.affiliateUrl) body.affiliateUrl = toolForm.affiliateUrl;
      if (toolForm.iconUrl) body.iconUrl = toolForm.iconUrl;

      const res = await fetch(`${API_BASE}/tools/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setToolError(data?.message ?? '도구 추가에 실패했습니다.');
        return;
      }

      setToolSuccess('도구가 성공적으로 추가되었습니다.');
      setToolForm(EMPTY_TOOL_FORM);
    } catch (err) {
      setToolError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setToolSubmitting(false);
    }
  }

  async function handleLabSubmit() {
    setLabError('');
    setLabSuccess('');
    setLabSubmitting(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setLabError('인증 정보를 가져올 수 없습니다. 다시 로그인해 주세요.');
        return;
      }

      const stackArray = labForm.stack
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const body: Record<string, unknown> = {
        title: labForm.title,
        description: labForm.description,
        content: labForm.content,
        category: labForm.category,
        difficulty: labForm.difficulty,
        metric: labForm.metric,
        stack: stackArray,
      };
      if (labForm.emoji) body.emoji = labForm.emoji;
      if (labForm.color) body.color = labForm.color;

      const res = await fetch(`${API_BASE}/labs/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLabError(data?.message ?? '실험실 추가에 실패했습니다.');
        return;
      }

      setLabSuccess('실험실이 성공적으로 추가되었습니다.');
      setLabForm(EMPTY_LAB_FORM);
    } catch (err) {
      setLabError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLabSubmitting(false);
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">관리자 콘솔</h1>
          <p className="text-slate-500">도구 승인, 도구 추가, 실험실 추가를 관리하세요.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['approve', 'tool', 'lab'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === t
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {t === 'approve' ? '승인 관리' : t === 'tool' ? '도구 추가' : '실험실 추가'}
            </button>
          ))}
        </div>

        {tab === 'approve' && (
          <>
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
                      <div className="flex flex-col gap-2 shrink-0">
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
          </>
        )}

        {tab === 'tool' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">새 도구 추가</h2>

            {toolSuccess && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold">
                {toolSuccess}
              </div>
            )}
            {toolError && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold">
                {toolError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleToolSubmit();
              }}
              className="space-y-5"
            >
              <div>
                <label className={LABEL_CLASS}>이름 *</label>
                <input
                  type="text"
                  required
                  value={toolForm.name}
                  onChange={e => setToolForm({ ...toolForm, name: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="예: ChatGPT"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>한 줄 설명 *</label>
                <input
                  type="text"
                  required
                  value={toolForm.shortDesc}
                  onChange={e => setToolForm({ ...toolForm, shortDesc: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="대화형 AI 어시스턴트"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>상세 설명 *</label>
                <textarea
                  required
                  rows={4}
                  value={toolForm.description}
                  onChange={e => setToolForm({ ...toolForm, description: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="도구의 핵심 기능과 활용 사례를 자세히 설명하세요."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>카테고리 *</label>
                  <select
                    required
                    value={toolForm.category}
                    onChange={e => setToolForm({ ...toolForm, category: e.target.value as ToolForm['category'] })}
                    className={INPUT_CLASS}
                  >
                    {TOOL_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>가격 모델 *</label>
                  <select
                    required
                    value={toolForm.pricingModel}
                    onChange={e => setToolForm({ ...toolForm, pricingModel: e.target.value as ToolForm['pricingModel'] })}
                    className={INPUT_CLASS}
                  >
                    {PRICING_MODELS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>런치 URL *</label>
                <input
                  type="url"
                  required
                  value={toolForm.launchUrl}
                  onChange={e => setToolForm({ ...toolForm, launchUrl: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="https://"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>제휴 URL</label>
                <input
                  type="url"
                  value={toolForm.affiliateUrl}
                  onChange={e => setToolForm({ ...toolForm, affiliateUrl: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="https://"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>아이콘 URL</label>
                <input
                  type="url"
                  value={toolForm.iconUrl}
                  onChange={e => setToolForm({ ...toolForm, iconUrl: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="https://"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={toolForm.tags}
                  onChange={e => setToolForm({ ...toolForm, tags: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="AI, 챗봇, 자동화"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>평점 (0-5)</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={toolForm.rating}
                  onChange={e => setToolForm({ ...toolForm, rating: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="4.0"
                />
              </div>

              <button type="submit" disabled={toolSubmitting} className={SUBMIT_CLASS}>
                {toolSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    추가 중...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    도구 추가
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {tab === 'lab' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">새 실험실 추가</h2>

            {labSuccess && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold">
                {labSuccess}
              </div>
            )}
            {labError && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold">
                {labError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLabSubmit();
              }}
              className="space-y-5"
            >
              <div>
                <label className={LABEL_CLASS}>제목 *</label>
                <input
                  type="text"
                  required
                  value={labForm.title}
                  onChange={e => setLabForm({ ...labForm, title: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="예: Claude로 슬랙 봇 만들기"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>한 줄 설명 *</label>
                <input
                  type="text"
                  required
                  value={labForm.description}
                  onChange={e => setLabForm({ ...labForm, description: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="실험실의 핵심을 한 줄로"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>본문 내용 *</label>
                <textarea
                  required
                  rows={10}
                  value={labForm.content}
                  onChange={e => setLabForm({ ...labForm, content: e.target.value })}
                  className={`${INPUT_CLASS} font-mono`}
                  placeholder={'## Step 1. 제목\n내용\n\n## Step 2. 제목\n내용'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>카테고리 *</label>
                  <select
                    required
                    value={labForm.category}
                    onChange={e => setLabForm({ ...labForm, category: e.target.value as LabForm['category'] })}
                    className={INPUT_CLASS}
                  >
                    {LAB_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>난이도 *</label>
                  <select
                    required
                    value={labForm.difficulty}
                    onChange={e => setLabForm({ ...labForm, difficulty: e.target.value as LabForm['difficulty'] })}
                    className={INPUT_CLASS}
                  >
                    {LAB_DIFFICULTIES.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>이모지</label>
                <input
                  type="text"
                  value={labForm.emoji}
                  onChange={e => setLabForm({ ...labForm, emoji: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="🧪"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>핵심 지표 *</label>
                <input
                  type="text"
                  required
                  value={labForm.metric}
                  onChange={e => setLabForm({ ...labForm, metric: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="응답 시간 80% 단축"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>스택 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={labForm.stack}
                  onChange={e => setLabForm({ ...labForm, stack: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="Claude, Slack API, Vercel"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>컬러 (Tailwind 그라데이션)</label>
                <input
                  type="text"
                  value={labForm.color}
                  onChange={e => setLabForm({ ...labForm, color: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="from-sky-500 to-indigo-600"
                />
              </div>

              <button type="submit" disabled={labSubmitting} className={SUBMIT_CLASS}>
                {labSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    추가 중...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">science</span>
                    실험실 추가
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
