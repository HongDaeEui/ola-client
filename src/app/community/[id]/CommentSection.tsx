'use client';
import { API_BASE } from '@/lib/api';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';


interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { username: string; avatarUrl?: string; email: string };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export default function CommentSection({ postId }: { postId: string }) {
  const { user, signInWithGoogle } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/comments?postId=${postId}`)
      .then(r => r.ok ? r.json() : [])
      .then(setComments);
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text.trim(),
          postId,
          userEmail: user.email,
          userName: user.user_metadata?.full_name ?? user.email ?? 'Anonymous',
        }),
      });
      if (res.ok) {
        const created: Comment = await res.json();
        setComments(prev => [...prev, created]);
        setText('');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!user?.email) return;
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/comments/${id}?userEmail=${encodeURIComponent(user.email)}`, {
        method: 'DELETE',
      });
      setComments(prev => prev.filter(c => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-sky-500">chat</span>
        댓글
        <span className="text-sky-600 font-extrabold">{comments.length}</span>
      </h2>

      {/* Comment list */}
      <div className="space-y-4 mb-8">
        {comments.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
            첫 댓글을 남겨보세요!
          </p>
        )}
        {comments.map(c => (
          <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 px-6 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                  {c.author.username.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">@{c.author.username}</span>
                  <span className="text-xs text-slate-400 ml-2">{timeAgo(c.createdAt)}</span>
                </div>
              </div>
              {user?.email === c.author.email && (
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deletingId === c.id}
                  className="text-slate-300 hover:text-rose-400 transition-colors shrink-0"
                >
                  {deletingId === c.id ? (
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin block" />
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  )}
                </button>
              )}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-10">
              {c.content}
            </p>
          </div>
        ))}
      </div>

      {/* Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase">
              {(user.user_metadata?.full_name ?? user.email ?? '?').charAt(0)}
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {user.user_metadata?.full_name ?? user.email}
            </span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={3}
            className="w-full text-sm text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 resize-none focus:outline-none leading-relaxed bg-transparent"
          />
          <div className="flex justify-end mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="flex items-center gap-1.5 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all disabled:opacity-40"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[16px]">send</span>
              )}
              등록
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">댓글을 달려면 로그인이 필요해요.</p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            Google로 로그인
          </button>
        </div>
      )}
    </section>
  );
}
