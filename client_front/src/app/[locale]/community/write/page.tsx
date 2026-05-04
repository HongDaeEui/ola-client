"use client";
import { API_BASE } from '@/lib/api';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { ImageUpload } from '@/components/ImageUpload';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const DRAFT_KEY = 'ola_post_draft';

const CATEGORIES = ['실천형 노하우', '작품 공유', '자유게시판', '전문 리포트'];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  '실천형 노하우': 'AI 툴을 활용한 실제 경험과 팁 공유',
  '작품 공유': '직접 만든 AI 결과물 / 프로젝트 공개',
  '자유게시판': '자유롭게 이야기 나누는 공간',
  '전문 리포트': '심층 분석, 트렌드 리포트',
};

export default function WritePage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.title) setTitle(d.title);
        if (d.content) setContent(d.content);
        if (d.category) setCategory(d.category);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, category }));
  }, [title, content, category]);

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = '제목을 입력해주세요.';
    if (!category) e.category = '카테고리를 선택해주세요.';
    if (content.trim().length < 20) e.content = `본문을 최소 20자 이상 작성해주세요. (현재 ${content.trim().length}자)`;
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
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          ...(imageUrl ? { imageUrl } : {}),
          userName: user!.user_metadata?.name ?? user!.user_metadata?.full_name ?? user!.email,
        }),
      });
      if (!res.ok) throw new Error();
      const post = await res.json();
      localStorage.removeItem(DRAFT_KEY);
      router.push(`/community/${post.id}`);
    } catch {
      setErrors({ submit: '게시 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-['Noto_Sans_KR'] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[32px] text-sky-500">edit_note</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">로그인 후 글을 쓸 수 있어요</h2>
          <p className="text-slate-500 mb-8">Ola 커뮤니티에서 당신의 AI 경험을 나눠주세요.</p>
          <button onClick={signInWithGoogle}
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-700 transition-all">
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

        <div className="flex items-center justify-between mb-8">
          <Link href="/community" className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors text-sm">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            커뮤니티
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">초안 자동저장 중</span>
            <button type="submit" form="post-form" disabled={submitting}
              className="flex items-center gap-2 bg-sky-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-sky-700 transition-all disabled:opacity-60">
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[16px]">send</span>
              )}
              게시하기
            </button>
          </div>
        </div>

        <form id="post-form" onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">

            <div className="flex items-center gap-3 px-8 pt-8 pb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                {(user.user_metadata?.name ?? user.email ?? 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{user.user_metadata?.name ?? '사용자'}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="px-8 pt-6">
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
                <p className="text-xs text-slate-400 mt-2 ml-1">{CATEGORY_DESCRIPTIONS[category]}</p>
              )}
              {errors.category && (
                <p className="text-xs text-rose-500 font-bold mt-1">{errors.category}</p>
              )}
            </div>

            <div className="px-8 pt-6">
              <input
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })); }}
                placeholder="제목을 입력하세요"
                maxLength={100}
                className={`w-full text-2xl md:text-3xl font-extrabold text-slate-900 placeholder:text-slate-200 outline-none bg-transparent tracking-tight leading-tight ${errors.title ? 'placeholder:text-rose-200' : ''}`}
              />
              {errors.title && (
                <p className="text-xs text-rose-500 font-bold mt-1">{errors.title}</p>
              )}
            </div>

            <div className="mx-8 my-5 border-b border-slate-100" />

            <div className="px-8 pb-4">
              <ImageUpload
                imageUrl={imageUrl}
                onUpload={url => setImageUrl(url)}
                onRemove={() => setImageUrl(null)}
              />
            </div>

            <div className="px-8 pb-8">
              <textarea
                value={content}
                onChange={e => { setContent(e.target.value); setErrors(p => ({ ...p, content: '' })); }}
                placeholder={"당신의 AI 경험을 자유롭게 나눠주세요.\n\n어떤 툴을 써봤나요? 어떤 결과가 나왔나요?\n실패한 경험도 커뮤니티에게는 큰 도움이 됩니다."}
                rows={16}
                className="w-full text-base text-slate-700 placeholder:text-slate-300 leading-relaxed outline-none bg-transparent resize-none font-medium"
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                {errors.content ? (
                  <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {errors.content}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">마크다운 미지원 · 줄바꿈으로 단락 구분</p>
                )}
                <span className={`text-xs font-bold ${charCount >= 20 ? 'text-emerald-500' : 'text-slate-400'}`}>
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

      </div>
    </div>
  );
}
