'use client';

import { motion } from 'framer-motion';

export function OlaVerifiedBadge() {
  return (
    <div className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50" title="Ola Community Verified">
      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
      <span className="text-[10px] font-black uppercase tracking-wider">Verified</span>
    </div>
  );
}

export function LivePulseBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50" title="Currently Live">
      <div className="relative flex h-2 w-2 items-center justify-center">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider">Live Now</span>
    </div>
  );
}
