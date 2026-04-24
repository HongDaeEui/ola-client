"use client";
import { API_BASE } from '@/lib/api';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
const WS_URL = API_BASE.replace(/\/api$/, '');
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

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user?.email) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
      setUnread(data.filter((n: Notification) => !n.read).length);
      setLoaded(true);
    } catch { /* ignore */ }
  }, [user?.email]);

  // WebSocket connection
  useEffect(() => {
    if (!user?.email) return;

    // Initial fetch for unread count
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) return;
        const res = await fetch(`${API_BASE}/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        setUnread(d.count ?? 0);
      } catch { /* ignore */ }
    })();

    const socket = io(`${WS_URL}/notifications`, {
      query: { userEmail: user.email },
      transports: ['websocket', 'polling'],
      reconnectionDelay: 2000,
      reconnectionDelayMax: 30000,
    });
    socketRef.current = socket;

    socket.on('notification', (n: Notification) => {
      setUnread(prev => prev + 1);
      setNotifications(prev => [n, ...prev]);
    });

    socket.on('connect_error', (err) => {
      console.warn('[NotificationBell] WS connect error:', err.message);
    });

    return () => {
      socket.off('connect_error');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.email]);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  async function handleOpen() {
    if (!open) {
      setOpen(true);
      await fetchAll();
    } else {
      setOpen(false);
    }
  }

  async function handleMarkAllRead() {
    if (!user?.email) return;
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;
    await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  }

  async function handleClickNotification(id: string) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
    setOpen(false);
  }

  if (!user) return null;

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={handleOpen}
        aria-label="알림"
        className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800"
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">알림</h3>
            {unread > 0 && (
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
            {!loaded ? (
              <div className="py-8 flex justify-center">
                <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-[36px] text-slate-200 block mb-2">notifications_off</span>
                <p className="text-sm text-slate-400 font-medium">알림이 없어요</p>
              </div>
            ) : (
              notifications.map(n => (
                <Link
                  key={n.id}
                  href={targetHref(n)}
                  onClick={() => handleClickNotification(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0 ${!n.read ? 'bg-sky-50/50 dark:bg-sky-900/20' : ''}`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
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
                    <div className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0 mt-1.5" />
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
