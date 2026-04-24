"use client";
import { API_BASE } from '@/lib/api';

import { useEffect } from 'react';
export const runtime = "edge";
export const revalidate = 300;


export function ViewTracker({ type, id }: { type: 'posts' | 'prompts'; id: string }) {
  useEffect(() => {
    fetch(`${API_BASE}/${type}/${id}/view`, { method: 'PATCH' }).catch(() => {});
  }, [type, id]);

  return null;
}
