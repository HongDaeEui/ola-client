"use client";
import { API_BASE } from '@/lib/api';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
export const runtime = "edge";
export const revalidate = 300;

const supabase = createClient();


interface Props {
  targetType: 'POST' | 'PROMPT' | 'LAB' | 'TOOL';
  targetId: string;
  initialLikes: number;
  variant?: 'row' | 'column';
}

export function LikeBookmarkButtons({ targetType, targetId, initialLikes, variant = 'row' }: Props) {
  const { user, signInWithGoogle } = useAuth();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  useEffect(() => {
    if (!user) return;
    const uid = user.id;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) return;
        const authHeaders = { Authorization: `Bearer ${token}` };
        const [l, b] = await Promise.all([
          fetch(`${API_BASE}/likes/status?userId=${uid}&targetType=${targetType}&targetId=${targetId}`, { headers: authHeaders }).then(r => r.json()),
          fetch(`${API_BASE}/bookmarks/status?targetType=${targetType}&targetId=${targetId}`, { headers: authHeaders }).then(r => r.json()),
        ]);
        setLiked(l.liked);
        setBookmarked(b.bookmarked);
      } catch { /* ignore */ }
    })();
  }, [user, targetType, targetId]);

  function requireLogin() {
    setShowLoginHint(true);
    setTimeout(() => setShowLoginHint(false), 3000);
  }

  async function toggleLike() {
    if (!user) { requireLogin(); return; }
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/likes/toggle`, {
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
    if (!user) { requireLogin(); return; }
    if (loading) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch(`${API_BASE}/bookmarks/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetType, targetId }),
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
      <motion.button
        onClick={toggleLike}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
          liked
            ? 'bg-rose-500 text-white hover:bg-rose-600'
            : 'bg-slate-900 text-white hover:bg-slate-700'
        } ${isColumn ? 'justify-center w-full' : ''}`}
      >
        <motion.span
          key={liked ? 'liked' : 'not-liked'}
          initial={{ scale: 1.6, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="material-symbols-outlined text-[18px]"
          style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
        >
          thumb_up
        </motion.span>
        좋아요 {likes}
      </motion.button>
      <motion.button
        onClick={toggleBookmark}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
          bookmarked
            ? 'bg-sky-500 text-white hover:bg-sky-600'
            : 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50'
        } ${isColumn ? 'justify-center w-full' : ''}`}
      >
        <motion.span
          key={bookmarked ? 'saved' : 'not-saved'}
          initial={{ scale: 1.6, y: -4 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="material-symbols-outlined text-[18px]"
          style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}
        >
          bookmark
        </motion.span>
        {bookmarked ? '저장됨' : '북마크'}
      </motion.button>

      {/* Login hint toast */}
      {showLoginHint && (
        <div className={`${isColumn ? 'w-full' : ''} bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2`}>
          <span>로그인이 필요해요</span>
          <button
            onClick={signInWithGoogle}
            className="bg-white text-slate-900 px-2.5 py-1 rounded-lg text-xs font-black hover:bg-slate-100 transition-colors shrink-0"
          >
            로그인
          </button>
        </div>
      )}
    </div>
  );
}
