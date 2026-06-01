"use client";
import { API_BASE } from '@/lib/api';

import { useState, useEffect, useRef } from 'react';
import { Link } from '@/i18n/routing';
import useSWR, { useSWRConfig } from 'swr';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT';
  message: string;
  targetType: string;
  targetId: string;
  targetTitle: string | null;
  read: boolean;
  createdAt: string;
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

function targetHref(n: Notification) {
  if (n.targetType === 'POST') return `/community/${n.targetId}`;
  if (n.targetType === 'PROMPT') return `/prompts/${n.targetId}`;
  return '/';
}

const fetcher = async (url: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('No token');
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { mutate } = useSWRConfig();

  // 폴링: 안 읽은 알림 개수 (10초마다 갱신)
  const { data: unreadData } = useSWR(
    user?.email ? `${API_BASE}/notifications/unread-count` : null,
    fetcher,
    { refreshInterval: 120000, revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  // 드롭다운 열릴 때만 전체 목록 패치
  const { data: notifications, isLoading } = useSWR<Notification[]>(
    open && user?.email ? `${API_BASE}/notifications` : null,
    fetcher
  );

  const unreadCount = unreadData?.count ?? 0;

  // 바깥 클릭 시 닫기
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  async function handleMarkAllRead() {
    if (!user?.email) return;
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;
    
    // UI 즉시 반영 (Optimistic UI)
    if (notifications) {
      mutate(`${API_BASE}/notifications`, notifications.map(n => ({ ...n, read: true })), false);
    }
    mutate(`${API_BASE}/notifications/unread-count`, { count: 0 }, false);

    await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // 서버 데이터로 최종 검증
    mutate(`${API_BASE}/notifications`);
    mutate(`${API_BASE}/notifications/unread-count`);
  }

  async function handleClickNotification(id: string) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;

    // Optimistic UI update
    if (notifications) {
      mutate(`${API_BASE}/notifications`, notifications.map(n => n.id === id ? { ...n, read: true } : n), false);
    }
    mutate(`${API_BASE}/notifications/unread-count`, { count: Math.max(0, unreadCount - 1) }, false);

    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    mutate(`${API_BASE}/notifications`);
    mutate(`${API_BASE}/notifications/unread-count`);
    setOpen(false);
  }

  if (!user) return null;

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="알림"
        className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800"
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">알림</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                모두 읽음
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !notifications || notifications.length === 0 ? (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-[36px] text-slate-200 block mb-2">notifications_off</span>
                <p className="text-sm text-slate-400 font-medium">알림이 없어요</p>
              </div>
            ) : (
              notifications.map(n => (
                <Link
                  key={n.id}
                  prefetch={false}
                  href={targetHref(n)}
                  onClick={() => handleClickNotification(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0 ${!n.read ? 'bg-sky-50/50 dark:bg-sky-900/20' : ''}`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === 'LIKE' ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {n.type === 'LIKE' ? 'thumb_up' : 'chat_bubble'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                      {n.message}
                    </p>
                    {n.targetTitle && (
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">"{n.targetTitle}"</p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1">{relativeTime(n.createdAt)}</p>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <div className="w-2 h-2 bg-sky-500 rounded-full shrink-0 mt-1.5" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
