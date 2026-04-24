"use client";

import { useTheme } from './ThemeProvider';
export const runtime = "edge";
export const revalidate = 300;

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800"
    >
      <span className="material-symbols-outlined text-[22px]">
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
