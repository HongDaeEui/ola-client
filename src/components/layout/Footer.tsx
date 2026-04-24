import { Link } from '@/i18n/routing';
import Image from "next/image";
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="w-full rounded-t-[3rem] mt-20 bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-12 gap-8 max-w-[1920px] mx-auto border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
        <img 
          src="/logo.png" 
          alt="Ola All-round AI club" 
          className="h-14 w-auto object-contain mix-blend-multiply" 
        />
        <p className="font-['Pretendard'] text-xs uppercase tracking-widest text-slate-500 mt-2">
          © 2024 Ola AI. All-round AI club.
        </p>
      </div>
      <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 font-['Pretendard'] text-xs uppercase tracking-widest">
        <Link href="#" className="text-slate-500 hover:text-teal-500 dark:hover:text-teal-300 transition-colors hover:underline underline-offset-4">{t('privacy')}</Link>
        <Link href="#" className="text-slate-500 hover:text-teal-500 dark:hover:text-teal-300 transition-colors hover:underline underline-offset-4">{t('terms')}</Link>
        <Link href="#" className="text-slate-500 hover:text-teal-500 dark:hover:text-teal-300 transition-colors hover:underline underline-offset-4">{t('contact')}</Link>
        <Link href="#" className="text-slate-500 hover:text-teal-500 dark:hover:text-teal-300 transition-colors hover:underline underline-offset-4">{t('careers')}</Link>
        <Link href="#" className="text-slate-500 hover:text-teal-500 dark:hover:text-teal-300 transition-colors hover:underline underline-offset-4">{t('press')}</Link>
        <Link href="#" className="text-slate-500 hover:text-teal-500 dark:hover:text-teal-300 transition-colors hover:underline underline-offset-4">{t('support')}</Link>
      </div>
    </footer>
  );
}
