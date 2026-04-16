'use client';

import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`absolute bottom-3 right-3 w-8 h-8 rounded-full shadow-md border flex items-center justify-center transition-all ${
        copied
          ? 'bg-emerald-500 text-white border-emerald-500'
          : 'bg-white border-slate-100 text-slate-400 hover:bg-sky-600 hover:text-white hover:border-sky-600'
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">
        {copied ? 'check' : 'content_copy'}
      </span>
    </button>
  );
}
