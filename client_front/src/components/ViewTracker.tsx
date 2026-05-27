"use client";
import { API_BASE } from '@/lib/api';

import { useEffect } from 'react';


export function ViewTracker({ type, id }: { type: 'posts' | 'prompts'; id: string }) {
  useEffect(() => {
    const key = `view-tracked:${type}:${id}`;
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(key)) return;

    const track = () => {
      // Prevent duplicate view increments in same browser session.
      sessionStorage.setItem(key, '1');
      fetch(`${API_BASE}/${type}/${id}/view`, { method: 'PATCH', keepalive: true }).catch(() => {});
    };

    if (document.visibilityState === 'visible') {
      track();
      return;
    }

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', onVisible);
      track();
    };

    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [type, id]);

  return null;
}
