'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://ola-backend-psi.vercel.app/api';

const CATEGORIES = ['이미지', '텍스트', '코딩', '비디오', '에이전트', '음악'];

export default function PromptShareButton() {
  const { user, signInWithGoogle } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '',
    toolName: '',
    category: '이미지',
    content: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          userEmail: user.email,
          userName: user.user_metadata?.full_name ?? user.email ?? 'Anonymous',
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ title: '', toolName: '', category: '이미지', content: '' });
        setTimeout(() => {
          setSuccess(false);
          setOpen(false);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-700 transition-all"
      >
        프롬프트 공유하기
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">프롬프트 공유하기</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-6">
              {!user ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-5xl text-slate-200 block mb-4">lock</span>
                  <p className="text-slate-600 font-medium mb-6">로그인 후 프롬프트를 공유할 수 있어요.</p>
                  <button
                    onClick={signInWithGoogle}
                    className="flex items-center gap-2 mx-auto bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-700 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    Google로 로그인
                  </button>
                </div>
              ) : success ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-5xl text-emerald-400 block mb-4">check_circle</span>
                  <p className="text-slate-700 font-bold text-lg">공유 완료!</p>
                  <p className="text-slate-500 text-sm mt-1">프롬프트가 등록되었습니다.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">제목</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="프롬프트 제목을 입력하세요"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-sky-400 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">사용 AI 도구</label>
                      <input
                        name="toolName"
                        value={form.toolName}
                        onChange={handleChange}
                        required
                        placeholder="예: Midjourney v6.5"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-sky-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">카테고리</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-sky-400 transition-all bg-white"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">프롬프트 내용</label>
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="프롬프트 내용을 입력하세요..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-sky-400 transition-all font-mono resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">share</span>
                    )}
                    공유하기
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
