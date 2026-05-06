'use client';
import { API_BASE } from '@/lib/api';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();


interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string | null;
  author: { username: string; avatarUrl?: string; email: string };
  replies?: Comment[];
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

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export default function CommentSection({ postId }: { postId: string }) {
  const { user, signInWithGoogle } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

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
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: text.trim(),
          postId,
          userName: user.user_metadata?.full_name ?? user.email ?? 'Anonymous',
        }),
      });
      if (res.ok) {
        const created: Comment = await res.json();
        setComments(prev => [...prev, { ...created, replies: created.replies ?? [] }]);
        setText('');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!user) return;
    setDeletingId(id);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API_BASE}/comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setComments(prev => prev.filter(c => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteReply(parentId: string, replyId: string) {
    if (!user) return;
    setDeletingId(replyId);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API_BASE}/comments/${replyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setComments(prev =>
          prev.map(c =>
            c.id === parentId
              ? { ...c, replies: (c.replies ?? []).filter(r => r.id !== replyId) }
              : c,
          ),
        );
      }
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(c: Comment) {
    setEditingId(c.id);
    setEditText(c.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText('');
  }

  async function handleSaveEdit(id: string, isReply: boolean, parentId?: string) {
    if (!user || !editText.trim()) return;
    setSavingEdit(true);
    try {
      const token = await getToken();
      if (!token) {
        cancelEdit();
        return;
      }
      const res = await fetch(`${API_BASE}/comments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editText.trim() }),
      });
      if (!res.ok) {
        cancelEdit();
        return;
      }
      const updated: Comment = await res.json();
      if (isReply && parentId) {
        setComments(prev =>
          prev.map(c =>
            c.id === parentId
              ? {
                  ...c,
                  replies: (c.replies ?? []).map(r =>
                    r.id === id ? { ...r, content: updated.content, updatedAt: updated.updatedAt } : r,
                  ),
                }
              : c,
          ),
        );
      } else {
        setComments(prev =>
          prev.map(c =>
            c.id === id ? { ...c, content: updated.content, updatedAt: updated.updatedAt } : c,
          ),
        );
      }
      setEditingId(null);
      setEditText('');
    } catch {
      cancelEdit();
    } finally {
      setSavingEdit(false);
    }
  }

  function startReply(commentId: string) {
    setReplyingToId(commentId);
    setReplyText('');
  }

  function cancelReply() {
    setReplyingToId(null);
    setReplyText('');
  }

  async function handleSubmitReply(parentId: string) {
    if (!user || !replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: replyText.trim(),
          postId,
          userName: user.user_metadata?.full_name ?? user.email ?? 'Anonymous',
          parentId,
        }),
      });
      if (res.ok) {
        const created: Comment = await res.json();
        setComments(prev =>
          prev.map(c =>
            c.id === parentId
              ? { ...c, replies: [...(c.replies ?? []), created] }
              : c,
          ),
        );
        setReplyingToId(null);
        setReplyText('');
      }
    } finally {
      setSubmittingReply(false);
    }
  }

  function renderReply(reply: Comment, parentId: string) {
    const isOwner = user?.email === reply.author.email;
    const isEditing = editingId === reply.id;
    return (
      <div
        key={reply.id}
        className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-5 py-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px] uppercase shrink-0">
              {reply.author.username.charAt(0)}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">@{reply.author.username}</span>
              <span className="text-xs text-slate-400 ml-2">{timeAgo(reply.createdAt)}</span>
              {reply.updatedAt && reply.updatedAt !== reply.createdAt && (
                <span className="text-xs text-slate-400 ml-1">(수정됨)</span>
              )}
            </div>
          </div>
          {isOwner && !isEditing && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEdit(reply)}
                className="text-slate-300 hover:text-sky-500 transition-colors"
                aria-label="수정"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                onClick={() => handleDeleteReply(parentId, reply.id)}
                disabled={deletingId === reply.id}
                className="text-slate-300 hover:text-rose-400 transition-colors"
                aria-label="삭제"
              >
                {deletingId === reply.id ? (
                  <span className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin block" />
                ) : (
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                )}
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="pl-9">
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              rows={2}
              className="w-full text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={cancelEdit}
                disabled={savingEdit}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg disabled:opacity-40"
              >
                취소
              </button>
              <button
                onClick={() => handleSaveEdit(reply.id, true, parentId)}
                disabled={savingEdit || !editText.trim()}
                className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-40"
              >
                {savingEdit ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-9">
            {reply.content}
          </p>
        )}
      </div>
    );
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
        {comments.map(c => {
          const isOwner = user?.email === c.author.email;
          const isEditing = editingId === c.id;
          const isReplying = replyingToId === c.id;
          return (
            <div key={c.id} className="space-y-3">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 px-6 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                      {c.author.username.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">@{c.author.username}</span>
                      <span className="text-xs text-slate-400 ml-2">{timeAgo(c.createdAt)}</span>
                      {c.updatedAt && c.updatedAt !== c.createdAt && (
                        <span className="text-xs text-slate-400 ml-1">(수정됨)</span>
                      )}
                    </div>
                  </div>
                  {isOwner && !isEditing && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(c)}
                        className="text-slate-300 hover:text-sky-500 transition-colors"
                        aria-label="수정"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="text-slate-300 hover:text-rose-400 transition-colors"
                        aria-label="삭제"
                      >
                        {deletingId === c.id ? (
                          <span className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin block" />
                        ) : (
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <div className="pl-10">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={3}
                      className="w-full text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={cancelEdit}
                        disabled={savingEdit}
                        className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg disabled:opacity-40"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSaveEdit(c.id, false)}
                        disabled={savingEdit || !editText.trim()}
                        className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-40"
                      >
                        {savingEdit ? '저장 중...' : '저장'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-10">
                    {c.content}
                  </p>
                )}
                {!isEditing && user && (
                  <div className="pl-10 mt-2">
                    <button
                      onClick={() => (isReplying ? cancelReply() : startReply(c.id))}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">reply</span>
                      {isReplying ? '취소' : '답글'}
                    </button>
                  </div>
                )}
              </div>

              {/* Replies */}
              {(c.replies?.length ?? 0) > 0 && (
                <div className="pl-8 space-y-2">
                  {c.replies!.map(r => renderReply(r, c.id))}
                </div>
              )}

              {/* Reply input */}
              {isReplying && (
                <div className="pl-8">
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="답글을 입력하세요..."
                      rows={2}
                      className="w-full text-sm text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 resize-none focus:outline-none leading-relaxed bg-transparent"
                    />
                    <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <button
                        onClick={cancelReply}
                        disabled={submittingReply}
                        className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg disabled:opacity-40"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSubmitReply(c.id)}
                        disabled={submittingReply || !replyText.trim()}
                        className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all disabled:opacity-40"
                      >
                        {submittingReply ? (
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="material-symbols-outlined text-[14px]">send</span>
                        )}
                        등록
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase">
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
