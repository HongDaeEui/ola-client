"use client";

import { useEffect } from 'react';

const API = 'https://ola-backend-psi.vercel.app/api';

export function ViewTracker({ type, id }: { type: 'posts' | 'prompts'; id: string }) {
  useEffect(() => {
    fetch(`${API}/${type}/${id}/view`, { method: 'PATCH' }).catch(() => {});
  }, [type, id]);

  return null;
}
