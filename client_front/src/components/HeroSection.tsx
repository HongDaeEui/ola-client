'use client';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { SpringButton } from '@/components/motion';

const HINT_KEYWORDS = ['ChatGPT', '이미지 생성', 'Cursor', '자동화', 'Suno', '영상번역'];

/* ── Animated Hero Section ── */
export default function HeroSection({ tools }: { tools: { name: string; iconUrl?: string }[] }) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
  };

  const logos = tools.filter(t => t.iconUrl).slice(0, 12);

  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
      {/* Announcement Banner */}
      <motion.div variants={fadeUp} className="absolute top-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-10 bg-teal-500/95 hover:bg-teal-600 backdrop-blur-md text-white py-2.5 px-6 text-sm font-bold shadow-lg shadow-teal-500/20 rounded-full border border-teal-400/30 transition-colors">
        <Link href="/labs" className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[16px]">campaign</span>
          [공지] 26년 6월 오프라인 실험실(Labs) 모임 신청 안내 - 선착순 마감 주의! 👉 참여하기
        </Link>
      </motion.div>

      <motion.div
        className="max-w-4xl mx-auto space-y-5"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={fadeUp} className="text-sky-600 font-semibold tracking-wider text-sm uppercase">
          일상을 더 창의롭게 만드는 AI 커뮤니티
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
          {[
            { icon: 'extension', label: '65+ AI 도구' },
            { icon: 'people', label: '커뮤니티 활성' },
            { icon: 'bolt', label: '무료 시작' },
          ].map(({ icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800 px-3 py-1 rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">{icon}</span>
              {label}
            </span>
          ))}
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          함께 배우고,<br />직접 만들고,<br />AI로 나의 삶을 풍요롭게
        </motion.h1>
        <motion.p variants={fadeUp} className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          글쓰기, 이미지, 영상, 음악, 자동화까지<br className="hidden md:block" />
          다양한 AI 도구를 직접 실험하고 나누는 실전형 AI 커뮤니티
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-3 pt-2 w-full max-w-sm sm:max-w-none mx-auto">
          <SpringButton className="w-full sm:w-auto">
            <Link href="/tools" className="block w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-200 dark:shadow-none text-center">
              도구 탐색
            </Link>
          </SpringButton>
          <SpringButton className="w-full sm:w-auto">
            <Link href="/labs" className="block w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-8 py-3.5 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center">
              AI 실험실
            </Link>
          </SpringButton>
          <SpringButton className="w-full sm:w-auto">
            <Link href="/community/write" className="block w-full bg-sky-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 dark:shadow-none text-center">
              글 쓰기
            </Link>
          </SpringButton>
        </motion.div>

        {/* Search */}
        <motion.form variants={fadeUp} action="/search" method="GET" className="relative max-w-3xl mx-auto mt-8 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 text-2xl group-focus-within:text-sky-500 transition-colors">search</span>
          </div>
          <input
            name="q"
            type="text"
            className="w-full pl-14 pr-28 py-5 text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-sky-500 hover:border-slate-300 transition-colors shadow-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 dark:text-white"
            placeholder="어떤 AI를 함께 써보고 싶으신가요?"
          />
          <button type="submit" className="absolute right-3 top-3 bottom-3 bg-sky-600 text-white px-6 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-md text-sm">
            검색
          </button>
        </motion.form>

        <motion.div variants={fadeUp} className="relative w-full overflow-hidden mt-6" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)' }}>
          <div className="animate-marquee gap-8 items-center">
            {[...logos, ...logos].map((tool, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={tool.iconUrl} alt={tool.name} width={36} height={36} className="w-9 h-9 rounded-xl object-contain shrink-0 opacity-60 hover:opacity-100 transition-opacity" />
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mt-3 text-sm">
          <span className="text-slate-500 mr-1">추천:</span>
          {HINT_KEYWORDS.map(kw => (
            <Link key={kw} prefetch={false} href={`/search?q=${encodeURIComponent(kw)}`}
              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900 dark:hover:text-sky-300 transition-colors">
              #{kw}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
