"use client";
import { API_BASE } from '@/lib/api';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const DRAFT_KEY = 'ola_prompt_draft';

const CATEGORIES = ['이미지', '텍스트', '코딩', '비디오', '에이전트', '음악'];
const POPULAR_TOOLS = ['ChatGPT', 'Claude', 'Midjourney', 'Stable Diffusion', 'Gemini', 'Suno', 'Runway', 'Perplexity'];

const CATEGORY_DESC: Record<string, string> = {
  '이미지': 'Midjourney, DALL-E, Stable Diffusion 등',
  '텍스트': '글쓰기, 요약, 번역 등 텍스트 생성',
  '코딩': '코드 작성, 리뷰, 디버깅 등',
  '비디오': 'Runway, Pika Labs 등 영상 생성',
  '에이전트': 'AI 에이전트, 자동화 워크플로우',
  '음악': 'Suno, Udio 등 음악 생성',
};

export default function PromptWritePage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [toolName, setToolName] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToolSuggestions, setShowToolSuggestions] = useState(false);

  // 초안 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.title) setTitle(d.title);
        if (d.toolName) setToolName(d.toolName);
        if (d.category) setCategory(d.category);
        if (d.content) setContent(d.content);
      } catch { /* ignore */ }
    }
  }, []);

  // 자동 저장
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, toolName, category, content }));
  }, [title, toolName, category, content]);

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = '제목을 입력해주세요.';
    if (!toolName.trim()) e.toolName = '사용한 AI 도구를 입력해주세요.';
    if (!category) e.category = '카테고리를 선택해주세요.';
    if (content.trim().length < 10) e.content = `프롬프트를 최소 10자 이상 작성해주세요. (현재 ${content.trim().length}자)`;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setErrors({ submit: '로그인이 만료되었습니다. 다시 로그인해주세요.' });
        setSubmitting(false);
        return;
      }
      const res = await fetch(`${API_BASE}/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          toolName: toolName.trim(),
          category,
          content: content.trim(),
          userName: user!.user_metadata?.name ?? user!.user_metadata?.full_name ?? user!.email,
        }),
      });
      if (!res.ok) throw new Error();
      const prompt = await res.json();
      localStorage.removeItem(DRAFT_KEY);
      router.push(`/prompts/${prompt.id}`);
    } catch {
      setErrors({ submit: '게시 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
      setSubmitting(false);
    }
  }

  // 로그인 게이트
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-['Noto_Sans_KR'] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[32px] text-violet-500">psychology</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">로그인 후 프롬프트를 공유할 수 있어요</h2>
          <p className="text-slate-500 mb-8">당신이 발견한 최고의 프롬프트를 Ola 커뮤니티와 나눠보세요.</p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-700 transition-all"
          >
            Google로 로그인
          </button>
        </div>
      </div>
    );
  }

  const charCount = content.trim().length;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 font-['Noto_Sans_KR']">
      <div className="max-w-3xl mx-auto px-4">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/prompts" className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors text-sm">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            프롬프트
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium hidden sm:block">초안 자동저장 중</span>
            <button
              type="submit"
              form="prompt-form"
              disabled={submitting}
              className="flex items-center gap-2 bg-sky-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-sky-700 transition-all disabled:opacity-60"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[16px]">share</span>
              )}
              공유하기
            </button>
          </div>
        </div>

        <form id="prompt-form" onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">

            {/* 작성자 */}
            <div className="flex items-center gap-3 px-8 pt-8 pb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                {(user.user_metadata?.name ?? user.email ?? 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{user.user_metadata?.name ?? '사용자'}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="px-8 pt-6 space-y-6">

              {/* 카테고리 */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { setCategory(cat); setErrors(p => ({ ...p, category: '' })); }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        category === cat
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-sky-300 hover:text-sky-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {category && (
                  <p className="text-xs text-slate-400 mt-2 ml-1">{CATEGORY_DESC[category]}</p>
                )}
                {errors.category && (
                  <p className="text-xs text-rose-500 font-bold mt-1">{errors.category}</p>
                )}
              </div>

              {/* 제목 */}
              <div>
                <input
                  value={title}
                  onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })); }}
                  placeholder="프롬프트 제목을 입력하세요"
                  maxLength={100}
                  className="w-full text-2xl md:text-3xl font-extrabold text-slate-900 placeholder:text-slate-200 outline-none bg-transparent tracking-tight leading-tight"
                />
                {errors.title && (
                  <p className="text-xs text-rose-500 font-bold mt-1">{errors.title}</p>
                )}
              </div>

              {/* AI 도구 */}
              <div className="relative">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">사용한 AI 도구</label>
                <input
                  value={toolName}
                  onChange={e => { setToolName(e.target.value); setErrors(p => ({ ...p, toolName: '' })); }}
                  onFocus={() => setShowToolSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowToolSuggestions(false), 150)}
                  placeholder="예: Midjourney v6.5, Claude 3.7..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-sky-400 transition-all"
                />
                {showToolSuggestions && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-2xl shadow-xl border border-slate-100 z-10 p-2 flex flex-wrap gap-1.5">
                    {POPULAR_TOOLS.filter(t =>
                      !toolName || t.toLowerCase().includes(toolName.toLowerCase())
                    ).map(t => (
                      <button
                        key={t}
                        type="button"
                        onMouseDown={() => { setToolName(t); setErrors(p => ({ ...p, toolName: '' })); }}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold hover:bg-sky-50 hover:text-sky-600 transition-colors border border-slate-100"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                {errors.toolName && (
                  <p className="text-xs text-rose-500 font-bold mt-1">{errors.toolName}</p>
                )}
              </div>
            </div>

            {/* 구분선 */}
            <div className="mx-8 my-5 border-b border-slate-100" />

            {/* 프롬프트 내용 */}
            <div className="px-8 pb-8">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-3">프롬프트 내용</label>
              <textarea
                value={content}
                onChange={e => { setContent(e.target.value); setErrors(p => ({ ...p, content: '' })); }}
                placeholder={"실제 사용한 프롬프트를 그대로 붙여넣으세요.\n\n예시:\n\"You are a senior UX designer. Analyze the following UI and provide 3 specific improvements with reasoning...\"\n\n어떤 상황에서 효과적인지, 어떻게 수정하면 좋은지 알려줘도 좋아요."}
                rows={14}
                className="w-full text-sm text-slate-700 placeholder:text-slate-300 leading-relaxed outline-none bg-transparent resize-none font-mono"
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                {errors.content ? (
                  <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {errors.content}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">실제로 동작한 프롬프트를 그대로 공유해주세요</p>
                )}
                <span className={`text-xs font-bold ${charCount >= 10 ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {charCount}자
                </span>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="mt-4 flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold px-4 py-3 rounded-2xl">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {errors.submit}
            </div>
          )}
        </form>

        {/* 팁 */}
        <div className="mt-6 bg-violet-50 border border-violet-100 rounded-2xl p-5">
          <h4 className="text-sm font-extrabold text-violet-700 mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">tips_and_updates</span>
            좋은 프롬프트 공유 팁
          </h4>
          <ul className="space-y-1.5 text-xs text-violet-600 font-medium">
            <li>• 실제로 테스트하고 효과를 확인한 프롬프트를 공유해주세요</li>
            <li>• 어떤 맥락에서 사용하면 좋은지 제목에 담아주세요</li>
            <li>• 변수(예: [주제], [스타일])는 괄호로 표시해주세요</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
