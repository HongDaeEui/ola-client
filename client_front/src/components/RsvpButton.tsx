"use client";


import { API_BASE } from '@/lib/api';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';


interface Props {
  meetupId: string;
  initialCount: number;
  variant?: 'featured' | 'card';
}

export function RsvpButton({ meetupId, initialCount, variant = 'card' }: Props) {
  const { user, signInWithGoogle } = useAuth();
  const [attending, setAttending] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`${API_BASE}/meetups/${meetupId}/status?userEmail=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(d => setAttending(d.attending))
      .catch(() => {});
  }, [user, meetupId]);

  async function toggle() {
    if (!user) {
      setShowLoginHint(true);
      setTimeout(() => setShowLoginHint(false), 3000);
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/meetups/${meetupId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Ola User',
        }),
      });
      const data = await res.json();
      setAttending(data.attending);
      setCount(data.attendeeCount);
    } finally {
      setLoading(false);
    }
  }

  if (variant === 'featured') {
    return (
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex -space-x-3">
            <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
            <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
            <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
            <div className="w-10 h-10 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-xs font-bold text-white">
              +{count}
            </div>
          </div>
          <button
            onClick={toggle}
            disabled={loading}
            className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${
              attending
                ? 'bg-white/20 text-white border border-white/50 hover:bg-white/30'
                : 'bg-primary text-on-primary shadow-primary/30'
            }`}
          >
            {attending ? '✓ 참가 신청 완료' : 'Reserve Seat'}
          </button>
        </div>
        {showLoginHint && (
          <button onClick={signInWithGoogle} className="text-xs font-bold text-white underline underline-offset-2">
            로그인 후 신청 가능해요
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={toggle}
        disabled={loading}
        className={`w-full py-3 rounded-full border font-bold transition-colors text-sm ${
          attending
            ? 'bg-primary text-on-primary border-primary'
            : 'border-primary/30 text-primary hover:bg-primary hover:text-on-primary'
        }`}
      >
        {attending ? '✓ 신청 완료' : 'Join Waitlist'}
      </button>
      {showLoginHint && (
        <button onClick={signInWithGoogle} className="text-xs font-bold text-primary underline underline-offset-2 text-center">
          로그인 후 신청 가능해요
        </button>
      )}
    </div>
  );
}
