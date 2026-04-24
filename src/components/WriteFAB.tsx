"use client";

import { Link } from '@/i18n/routing';

export function WriteFAB() {
  return (
    <Link
      href="/community/write"
      className="sm:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-sky-600 text-white rounded-full shadow-2xl shadow-sky-300 flex items-center justify-center hover:bg-sky-700 transition-all active:scale-95"
    >
      <span className="material-symbols-outlined text-[26px]">edit</span>
    </Link>
  );
}
