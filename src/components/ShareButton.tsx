"use client";

import { useState } from 'react';

interface Props {
  title: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, url, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = url ?? window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      className={className ?? 'flex items-center gap-2 bg-slate-50 text-slate-600 border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors'}
    >
      <span className="material-symbols-outlined text-[18px]">
        {copied ? 'check' : 'share'}
      </span>
      {copied ? '복사됨!' : '공유'}
    </button>
  );
}
