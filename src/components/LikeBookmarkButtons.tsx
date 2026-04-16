"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API = 'https://ola-backend-psi.vercel.app/api';

interface Props {
  targetType: 'POST' | 'PROMPT' | 'LAB' | 'TOOL';
  targetId: string;
  initialLikes: number;
  variant?: 'row' | 'column';
}

export function LikeBookmarkButtons({ targetType, targetId, initialLikes, variant = 'row' }: Props) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const uid = user.id;
    Promise.all([
      fetch(`${API}/likes/status?userId=${uid}&targetType=${targetType}&targetId=${targetId}`).then(r => r.json()),
      fetch(`${API}/bookmarks/status?userId=${uid}&targetType=${targetType}&targetId=${targetId}`).then(r => r.json()),
    ]).then(([l, b]) => {
      setLiked(l.liked);
      setBookmarked(b.bookmarked);
    }).catch(() => {});
  }, [user, targetType, targetId]);

  async function toggleLike() {
    if (!user) { alert('로그인이 필요합니다.'); return; }
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/likes/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, targetType, targetId }),
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikes(prev => data.liked ? prev + 1 : prev - 1);
    } finally {
      setLoading(false);
    }
  }

  async function toggleBookmark() {
    if (!user) { alert('로그인이 필요합니다.'); return; }
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/bookmarks/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, targetType, targetId }),
      });
      const data = await res.json();
      setBookmarked(data.bookmarked);
    } finally {
      setLoading(false);
    }
  }

  const isColumn = variant === 'column';

  return (
    <div className={`flex ${isColumn ? 'flex-col' : 'items-center'} gap-3`}>
      <button
        onClick={toggleLike}
        disabled={loading}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
          liked
            ? 'bg-rose-500 text-white hover:bg-rose-600'
            : 'bg-slate-900 text-white hover:bg-slate-700'
        } ${isColumn ? 'justify-center w-full' : ''}`}
      >
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>
          thumb_up
        </span>
        좋아요 {likes}
      </button>
      <button
        onClick={toggleBookmark}
        disabled={loading}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
          bookmarked
            ? 'bg-sky-500 text-white hover:bg-sky-600'
            : 'bg-sky-50 text-sky-700 border border-sky-100 hover:bg-sky-100'
        } ${isColumn ? 'justify-center w-full' : ''}`}
      >
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}>
          bookmark
        </span>
        {bookmarked ? '저장됨' : '북마크'}
      </button>
    </div>
  );
}
