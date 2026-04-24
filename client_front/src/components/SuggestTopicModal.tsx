'use client';
import { API_BASE } from '@/lib/api';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
export const runtime = "edge";
export const revalidate = 300;


export function SuggestTopicModal() {
  const { user, signInWithGoogle } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [format, setFormat] = useState<'온라인' | '오프라인' | '상관없음'>('상관없음');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { signInWithGoogle(); return; }
    if (!title.trim()) return;

    setLoading(true);
    try {
      await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[밋업 제안] ${title.trim()}`,
          content: `**제안 형식:** ${format}\n\n${desc.trim()}`,
          authorEmail: user.email,
          authorName: user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Ola User',
          category: 'general',
        }),
      });
      setDone(true);
    } catch {
      alert('제출 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setOpen(false);
    setTimeout(() => { setDone(false); setTitle(''); setDesc(''); setFormat('상관없음'); }, 300);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-primary font-bold hover:underline underline-offset-4 text-sm"
      >
        Submit Proposal
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">

            {done ? (
              /* 완료 상태 */
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">check_circle</span>
                </div>
                <h3 className="font-['Noto_Serif'] text-2xl font-bold text-on-surface dark:text-white mb-2">제안 완료!</h3>
                <p className="text-on-surface-variant dark:text-slate-400 text-sm mb-6">
                  커뮤니티에 등록됐어요. 운영진이 검토 후 밋업으로 기획할게요.
                </p>
                <button
                  onClick={close}
                  className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  닫기
                </button>
              </div>
            ) : (
              /* 입력 폼 */
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-['Noto_Serif'] text-2xl font-bold text-on-surface dark:text-white">밋업 주제 제안</h2>
                    <p className="text-on-surface-variant dark:text-slate-400 text-sm mt-1">함께 나눌 주제를 제안해주세요</p>
                  </div>
                  <button
                    onClick={close}
                    className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl text-on-surface-variant">close</span>
                  </button>
                </div>

                <form onSubmit={submit} className="space-y-5">
                  {/* 주제 */}
                  <div>
                    <label className="block text-sm font-semibold text-on-surface dark:text-slate-200 mb-2">
                      주제 제목 <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="예: Cursor AI 실전 활용법"
                      maxLength={80}
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-outline-variant/40 dark:border-slate-700 bg-surface-container-low dark:bg-slate-800 text-on-surface dark:text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    />
                  </div>

                  {/* 설명 */}
                  <div>
                    <label className="block text-sm font-semibold text-on-surface dark:text-slate-200 mb-2">
                      설명 <span className="text-on-surface-variant font-normal">(선택)</span>
                    </label>
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="어떤 내용을 다루면 좋을지 간략히 설명해주세요"
                      rows={3}
                      maxLength={300}
                      className="w-full px-4 py-3 rounded-2xl border border-outline-variant/40 dark:border-slate-700 bg-surface-container-low dark:bg-slate-800 text-on-surface dark:text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                    />
                  </div>

                  {/* 형식 */}
                  <div>
                    <label className="block text-sm font-semibold text-on-surface dark:text-slate-200 mb-2">선호 형식</label>
                    <div className="flex gap-2">
                      {(['온라인', '오프라인', '상관없음'] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFormat(f)}
                          className={`flex-1 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                            format === f
                              ? 'bg-primary text-on-primary border-primary'
                              : 'border-outline-variant/40 dark:border-slate-700 text-on-surface-variant dark:text-slate-400 hover:border-primary/50'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !title.trim()}
                    className="w-full py-3.5 rounded-full bg-primary text-on-primary font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? '제출 중...' : !user ? '로그인 후 제안하기' : '제안 제출하기'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
