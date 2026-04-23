"use client";
"use client";
"use client";
import { API_BASE } from '@/lib/api';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from '@/i18n/routing';
export const revalidate = 300;

const SAVE_KEY = 'ola_submit_draft';

type TabType = 'tool' | 'prompt';

const TOOL_CATEGORIES = ['텍스트 / 글쓰기', '비디오 / 아바타', '이미지 / 디자인', '에이전트 / 자동화', '코딩 / 개발', '음성 / 오디오', '검색 / 리서치', '생산성', '교육', '기타'];
const PROMPT_CATEGORIES = ['이미지 생성', '글쓰기 / 카피라이팅', '코딩', '데이터 분석', '마케팅', '번역', '교육', '업무 자동화', '기타'];
const PRICING = ['Free', 'Free Trial', 'Freemium', 'Paid'];

const TOOL_TIPS = [
  { icon: 'travel_explore', text: '직접 사용해보고 제출하면 승인률이 높아져요.' },
  { icon: 'short_text', text: '한 줄 요약은 검색 결과에서 가장 먼저 보입니다.' },
  { icon: 'lightbulb', text: '구체적인 사용 사례를 설명에 포함해주세요.' },
  { icon: 'sell', text: '가격 정보를 정확히 입력하면 사용자 신뢰도가 높아져요.' },
];

const PROMPT_TIPS = [
  { icon: 'data_object', text: '변수는 [대괄호]로 표시하면 재사용하기 좋아요.' },
  { icon: 'compress', text: '프롬프트가 길다고 좋은 건 아니에요. 명확함이 핵심입니다.' },
  { icon: 'tag', text: '테스트한 AI 모델을 태그에 포함해주세요.' },
  { icon: 'preview', text: '실제 출력 예시를 설명에 추가하면 북마크가 늘어나요.' },
];

// ── Tag Pill Input ──────────────────────────────
function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  function add(raw: string) {
    const val = raw.trim();
    if (val && !tags.includes(val) && tags.length < 8) {
      onChange([...tags, val]);
    }
    setInput('');
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(input);
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div
      className="flex flex-wrap gap-2 px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus-within:bg-white focus-within:border-sky-500 transition-all cursor-text min-h-[52px]"
      onClick={() => ref.current?.focus()}
    >
      {tags.map(tag => (
        <span key={tag} className="flex items-center gap-1 bg-sky-100 text-sky-700 text-sm font-bold px-3 py-1 rounded-full">
          {tag}
          <button type="button" onClick={() => onChange(tags.filter(t => t !== tag))} className="ml-0.5 hover:text-sky-900">×</button>
        </span>
      ))}
      <input
        ref={ref}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => add(input)}
        placeholder={tags.length === 0 ? 'Enter 또는 ,로 태그 추가 (최대 8개)' : ''}
        className="flex-1 min-w-[140px] bg-transparent outline-none text-sm font-medium placeholder:text-slate-300"
      />
    </div>
  );
}

// ── Main Page ───────────────────────────────────
export default function SubmitPage() {
  const { user, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState<TabType>('tool');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [tool, setTool] = useState({ name: '', launchUrl: '', shortDesc: '', description: '', category: '', pricingModel: '', tags: [] as string[] });
  const [prompt, setPrompt] = useState({ title: '', toolName: '', category: '', content: '', tags: [] as string[] });

  // Auto-save draft
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const { tab: t, tool: to, prompt: pr } = JSON.parse(saved);
        if (t) setTab(t);
        if (to) setTool(to);
        if (pr) setPrompt(pr);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ tab, tool, prompt }));
  }, [tab, tool, prompt]);

  function setT(f: string, v: string) { setTool(p => ({ ...p, [f]: v })); }
  function setP(f: string, v: string) { setPrompt(p => ({ ...p, [f]: v })); }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (tab === 'tool') {
      if (!tool.name) e.name = '도구 이름을 입력해주세요.';
      if (!tool.launchUrl) e.launchUrl = 'URL을 입력해주세요.';
      if (!tool.shortDesc) e.shortDesc = '한 줄 요약을 입력해주세요.';
      if (!tool.category) e.category = '카테고리를 선택해주세요.';
      if (tool.description.length < 50) e.description = `설명을 최소 50자 이상 입력해주세요. (현재 ${tool.description.length}자)`;
    } else {
      if (!prompt.title) e.title = '제목을 입력해주세요.';
      if (!prompt.toolName) e.toolName = '사용한 AI 도구를 입력해주세요.';
      if (!prompt.category) e.category = '카테고리를 선택해주세요.';
      if (prompt.content.length < 30) e.content = `프롬프트 내용을 최소 30자 이상 입력해주세요. (현재 ${prompt.content.length}자)`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (tab === 'tool') {
        const res = await fetch(`${API_BASE}/tools`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...tool, tags: tool.tags }),
        });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch(`${API_BASE}/prompts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...prompt,
            userEmail: user!.email,
            userName: user!.user_metadata?.name ?? user!.email,
          }),
        });
        if (!res.ok) throw new Error();
      }
      localStorage.removeItem(SAVE_KEY);
      setDone(true);
    } catch {
      setErrors({ submit: '제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Auth Gate ──
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-['Noto_Sans_KR'] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[32px] text-sky-500">lock</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">로그인이 필요합니다</h2>
          <p className="text-slate-500 mb-8">AI 도구 또는 프롬프트를 제출하려면 먼저 로그인해주세요.</p>
          <button onClick={signInWithGoogle} className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-700 transition-all">
            Google로 로그인
          </button>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-['Noto_Sans_KR'] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[32px] text-emerald-500">check_circle</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">제출 완료!</h2>
          <p className="text-slate-500 mb-8">관리자 검토 후 24시간 이내에 등록됩니다. 소중한 기여 감사합니다 🎉</p>
          <div className="flex gap-3 justify-center">
            <Link href={tab === 'tool' ? '/tools' : '/prompts'} className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-all">
              목록 보기
            </Link>
            <button
              onClick={() => {
                setDone(false);
                setTool({ name: '', launchUrl: '', shortDesc: '', description: '', category: '', pricingModel: '', tags: [] });
                setPrompt({ title: '', toolName: '', category: '', content: '', tags: [] });
              }}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              또 제출하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tips = tab === 'tool' ? TOOL_TIPS : PROMPT_TIPS;
  const err = (f: string) => errors[f] ? (
    <p className="text-xs text-rose-500 font-bold mt-1.5 flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">error</span>{errors[f]}
    </p>
  ) : null;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter mb-3">커뮤니티에 기여하기</h1>
          <p className="text-slate-500">당신의 발견과 노하우를 Ola 멤버들과 나눠보세요.</p>
        </div>

        {/* Tab */}
        <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 max-w-xs mx-auto mb-10 shadow-sm">
          {(['tool', 'prompt'] as TabType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === t ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {t === 'tool' ? '🛠 AI 도구' : '✨ 프롬프트'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-200/50">

              {/* Submitter info */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {(user.user_metadata?.name ?? user.email ?? 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{user.user_metadata?.name ?? '사용자'}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <span className="ml-auto text-xs text-slate-400 font-medium">초안 자동 저장됨</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {tab === 'tool' ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">도구 이름 <span className="text-rose-500">*</span></label>
                      <input value={tool.name} onChange={e => setT('name', e.target.value)} placeholder="예: Lindy.ai"
                        className={`w-full px-5 py-3.5 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-medium ${errors.name ? 'border-rose-300 focus:border-rose-400' : 'border-slate-100 focus:border-sky-500'}`} />
                      {err('name')}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">웹사이트 URL <span className="text-rose-500">*</span></label>
                      <input type="url" value={tool.launchUrl} onChange={e => setT('launchUrl', e.target.value)} placeholder="https://example.ai"
                        className={`w-full px-5 py-3.5 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-medium ${errors.launchUrl ? 'border-rose-300 focus:border-rose-400' : 'border-slate-100 focus:border-sky-500'}`} />
                      {err('launchUrl')}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">한 줄 요약 <span className="text-rose-500">*</span></label>
                      <input value={tool.shortDesc} onChange={e => setT('shortDesc', e.target.value)} placeholder="가장 강력한 자율형 비즈니스 AI 에이전트"
                        className={`w-full px-5 py-3.5 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-medium ${errors.shortDesc ? 'border-rose-300 focus:border-rose-400' : 'border-slate-100 focus:border-sky-500'}`} />
                      {err('shortDesc')}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">카테고리 <span className="text-rose-500">*</span></label>
                        <select value={tool.category} onChange={e => setT('category', e.target.value)}
                          className={`w-full px-5 py-3.5 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all font-medium appearance-none ${errors.category ? 'border-rose-300' : 'border-slate-100 focus:border-sky-500'}`}>
                          <option value="">선택</option>
                          {TOOL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        {err('category')}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">프라이싱</label>
                        <select value={tool.pricingModel} onChange={e => setT('pricingModel', e.target.value)}
                          className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-sky-500 outline-none transition-all font-medium appearance-none">
                          <option value="">선택</option>
                          {PRICING.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">도구 설명 <span className="text-rose-500">*</span> <span className="text-slate-400 font-normal">(최소 50자)</span></label>
                      <textarea rows={5} value={tool.description} onChange={e => setT('description', e.target.value)}
                        placeholder="핵심 기능, 차별점, 어떤 사람에게 유용한지 알려주세요."
                        className={`w-full px-5 py-4 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-medium resize-none ${errors.description ? 'border-rose-300 focus:border-rose-400' : 'border-slate-100 focus:border-sky-500'}`} />
                      <div className="flex justify-between items-center mt-1">
                        {err('description') ?? <span />}
                        <span className={`text-xs font-bold ml-auto ${tool.description.length >= 50 ? 'text-emerald-500' : 'text-slate-400'}`}>{tool.description.length}자</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">태그</label>
                      <TagInput tags={tool.tags} onChange={tags => setTool(p => ({ ...p, tags }))} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">프롬프트 제목 <span className="text-rose-500">*</span></label>
                      <input value={prompt.title} onChange={e => setP('title', e.target.value)} placeholder="예: 제품 상세 페이지 카피라이팅 마스터 프롬프트"
                        className={`w-full px-5 py-3.5 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-medium ${errors.title ? 'border-rose-300' : 'border-slate-100 focus:border-sky-500'}`} />
                      {err('title')}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">사용 AI 도구 <span className="text-rose-500">*</span></label>
                        <input value={prompt.toolName} onChange={e => setP('toolName', e.target.value)} placeholder="예: ChatGPT, Claude, Midjourney"
                          className={`w-full px-5 py-3.5 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-medium ${errors.toolName ? 'border-rose-300' : 'border-slate-100 focus:border-sky-500'}`} />
                        {err('toolName')}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">카테고리 <span className="text-rose-500">*</span></label>
                        <select value={prompt.category} onChange={e => setP('category', e.target.value)}
                          className={`w-full px-5 py-3.5 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all font-medium appearance-none ${errors.category ? 'border-rose-300' : 'border-slate-100 focus:border-sky-500'}`}>
                          <option value="">선택</option>
                          {PROMPT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        {err('category')}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">프롬프트 내용 <span className="text-rose-500">*</span> <span className="text-slate-400 font-normal">(최소 30자)</span></label>
                      <textarea rows={8} value={prompt.content} onChange={e => setP('content', e.target.value)}
                        placeholder={"변수는 [대괄호]로 표시하세요.\n예: [제품명]을 구매해야 하는 3가지 이유를 ..."}
                        className={`w-full px-5 py-4 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-mono text-sm resize-none ${errors.content ? 'border-rose-300' : 'border-slate-100 focus:border-sky-500'}`} />
                      <div className="flex justify-between items-center mt-1">
                        {err('content') ?? <span />}
                        <span className={`text-xs font-bold ml-auto ${prompt.content.length >= 30 ? 'text-emerald-500' : 'text-slate-400'}`}>{prompt.content.length}자</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">태그</label>
                      <TagInput tags={prompt.tags} onChange={tags => setPrompt(p => ({ ...p, tags }))} />
                    </div>
                  </>
                )}

                {errors.submit && (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold px-4 py-3 rounded-2xl">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {errors.submit}
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-lg hover:bg-slate-800 transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {submitting ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />제출 중...</>
                  ) : '심사 요청하기'}
                </button>

                <p className="text-center text-xs text-slate-400 leading-relaxed">
                  제출된 콘텐츠는 관리자 검토 후 24시간 이내에 등록됩니다.<br />
                  정책에 위배되는 내용은 등록이 거절될 수 있습니다.
                </p>
              </form>
            </div>
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-28">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">작성 팁</h3>
              <ul className="space-y-4">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[20px] text-sky-400 mt-0.5 shrink-0">{tip.icon}</span>
                    <p className="text-sm text-slate-600 leading-relaxed">{tip.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[18px] text-sky-500">verified</span>
                <p className="text-sm font-black text-sky-700">빠른 승인을 원한다면</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                설명이 구체적이고 실제 사용 경험이 담긴 제출은 평균 <strong>3시간</strong> 내 승인됩니다.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
