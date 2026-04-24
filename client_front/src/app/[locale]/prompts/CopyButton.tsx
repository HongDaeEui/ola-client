'use client';
'use client';
'use client';

import { useState } from 'react';

interface Props {
  text: string;
  /** inline 버튼 스타일 (label 있는 모드) */
  className?: string;
  label?: string;
}

export default function CopyButton({ text, className, label }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // inline labeled variant
  if (label !== undefined) {
    return (
      <button
        onClick={handleCopy}
        className={className ?? 'flex items-center gap-1.5 text-sm font-bold'}
      >
        <span className="material-symbols-outlined text-[16px]">
          {copied ? 'check' : 'content_copy'}
        </span>
        {copied ? '복사됨!' : label}
      </button>
    );
  }

  // default: absolute small icon button (for card overlay use)
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
