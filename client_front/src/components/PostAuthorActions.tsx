'use client';

import { useRouter } from '@/i18n/routing';
import { API_BASE } from '@/lib/api';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface PostAuthorActionsProps {
  postId: string;
  authorEmail: string;
}

export function PostAuthorActions({ postId, authorEmail }: PostAuthorActionsProps) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      const email =
        session.user.email ??
        (session.user.user_metadata?.email as string | undefined);
      if (email && email === authorEmail) setIsOwner(true);
    });
  }, [authorEmail]);

  if (!isOwner) return null;

  const handleDelete = async () => {
    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까? 복구할 수 없습니다.')) return;
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { alert('로그인이 만료되었습니다.'); return; }

      const res = await fetch(`${API_BASE}/posts/${postId}/user`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('삭제에 실패했습니다.');

      alert('게시글이 삭제되었습니다.');
      window.location.href = '/ko/community';
    } catch (err) {
      alert((err as Error).message || '삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4 md:mt-0 md:ml-auto">
      <button
        onClick={() => router.push(`/community/edit/${postId}`)}
        className="px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        수정
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1.5 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 rounded-lg transition-colors disabled:opacity-50"
      >
        {isDeleting ? '삭제 중...' : '삭제'}
      </button>
    </div>
  );
}
