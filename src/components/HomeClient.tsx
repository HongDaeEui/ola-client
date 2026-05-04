'use client';
import { getLogoUrl } from '@/lib/logo';

import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem, SpringButton } from '@/components/motion';
import { OlaVerifiedBadge } from '@/components/Badges';

/* ── Pricing color map ── */
const PRICING_COLOR: Record<string, string> = {
  Free: 'bg-emerald-50 text-emerald-600',
  Freemium: 'bg-sky-50 text-sky-600',
  'Free Trial': 'bg-violet-50 text-violet-600',
  Paid: 'bg-slate-100 text-slate-500',
};

const HINT_KEYWORDS = ['ChatGPT', '이미지 생성', 'Cursor', '자동화', 'Suno', '영상번역'];

/* ── Type Definitions ── */
interface Tool {
  id: string; name: string; shortDesc: string; description: string;
  category: string; pricingModel?: string; rating: number;
  tags: string[]; iconUrl?: string; coverUrl?: string; isFeatured: boolean;
}
interface Post {
  id: string; title: string; category: string; views: number; likes: number;
  createdAt: string; author: { username: string };
}
interface CategoryCount { category: string; count: number; }

interface HomeClientProps {
  tools: Tool[];
  posts: Post[];
  categories: CategoryCount[];
  marqueeTools?: { name: string; iconUrl?: string }[];
}

/* ── Animated Hero Section ── */
function HeroSection({ tools }: { tools: { name: string; iconUrl?: string }[] }) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
  };

  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-28 pb-20 px-4 sm:px-6 text-center">
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
          <div className="flex gap-8 items-center animate-marquee">
            {(() => {
              const logos = tools.filter(t => t.iconUrl).slice(0, 20);
              return [...logos, ...logos, ...logos, ...logos].map((tool, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={tool.iconUrl} alt={tool.name} width={36} height={36} className="w-9 h-9 rounded-xl object-contain shrink-0 opacity-60 hover:opacity-100 transition-opacity" />
              ));
            })()}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mt-3 text-sm">
          <span className="text-slate-500 mr-1">추천:</span>
          {HINT_KEYWORDS.map(kw => (
            <Link key={kw} href={`/search?q=${encodeURIComponent(kw)}`}
              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900 dark:hover:text-sky-300 transition-colors">
              #{kw}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Animated Tool Card ── */
function ToolCard({ tool }: { tool: Tool }) {
  return (
    <StaggerItem>
      <Link href={`/tools/${tool.id}`}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-lg hover:shadow-sky-100 dark:hover:shadow-sky-900/20 transition-all group flex flex-col h-full">
        <div className="flex gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0 overflow-hidden border border-slate-100 dark:border-slate-600 group-hover:scale-105 transition-transform duration-300">
            {tool.coverUrl || getLogoUrl(tool.iconUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tool.coverUrl || getLogoUrl(tool.iconUrl)} alt={tool.name} width={56} height={56} className="object-contain w-full h-full p-1" />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-slate-700 to-slate-900 group-hover:from-sky-600 group-hover:to-indigo-700 flex items-center justify-center text-white font-bold text-xl uppercase tracking-tighter transition-all duration-300">
                {tool.name.substring(0, 2)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">{tool.name}</h3>
              {tool.isFeatured && <span className="text-[9px] bg-sky-500 text-white px-1.5 py-0.5 rounded font-black uppercase shrink-0">TOP</span>}
              {tool.rating > 4.5 && <OlaVerifiedBadge />}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${PRICING_COLOR[tool.pricingModel ?? ''] ?? 'bg-slate-100 text-slate-600'}`}>
                {tool.pricingModel ?? 'Free'}
              </span>
              <div className="flex items-center text-[11px] text-slate-500 font-bold">
                <span className="material-symbols-outlined text-[12px] text-amber-400 mr-0.5">star</span>
                {tool.rating?.toFixed(1) ?? '—'}
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1 line-clamp-1">{tool.shortDesc}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed grow">{tool.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t border-slate-50 dark:border-slate-700">
          <span className="text-[10px] font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/40 px-2 py-0.5 rounded">{tool.category}</span>
          {(tool.tags ?? []).slice(0, 2).map(t => (
            <span key={t} className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">#{t}</span>
          ))}
        </div>
      </Link>
    </StaggerItem>
  );
}


/* ── Main Exported Client Component ── */
export default function HomeClient({ tools, posts, categories, marqueeTools }: HomeClientProps) {
  const gridTools = tools.slice(0, 9);
  const trendTools = tools.slice(0, 5);

  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 font-['Noto_Sans_KR']">
      {/* Hero */}
      <HeroSection tools={marqueeTools ?? tools} />

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">

        {/* Main Column */}
        <div className="flex-1">
          {/* Tab bar */}
          <ScrollReveal>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-6 sticky top-20 bg-slate-50 dark:bg-slate-950 z-10 pt-4">
              <div className="flex gap-1 sm:gap-4 overflow-x-auto hide-scrollbar">
                <Link href="/tools" className="text-sky-600 font-bold border-b-2 border-sky-600 pb-2 whitespace-nowrap px-2 text-sm">전체 도구</Link>
                <Link href="/tools?sort=rating" className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200 pb-2 whitespace-nowrap px-2 text-sm transition-colors">인기 도구</Link>
                <Link href="/tools?pricing=Free" className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200 pb-2 whitespace-nowrap px-2 text-sm transition-colors">무료 도구</Link>
                <Link href="/ranking" className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200 pb-2 whitespace-nowrap px-2 text-sm flex items-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-[14px] text-amber-400">local_fire_department</span>랭킹
                </Link>
              </div>
              <Link href="/tools?sort=rating" className="hidden sm:flex text-xs font-bold text-sky-600 hover:underline whitespace-nowrap">
                전체 보기 →
              </Link>
            </div>
          </ScrollReveal>

          {/* Tools Grid */}
          {gridTools.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {gridTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </StaggerContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
              <span className="material-symbols-outlined text-5xl mb-3">construction</span>
              <p className="text-sm font-medium">서버가 깨어나는 중이에요. 잠시 후 새로고침 해주세요.</p>
            </div>
          )}

          <ScrollReveal delay={0.3}>
            <div className="mt-10 text-center">
              <SpringButton>
                <Link href="/tools" className="inline-block bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors hover:shadow-sm">
                  도구 더보기 →
                </Link>
              </SpringButton>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-80 shrink-0 space-y-6">

          {/* Hot Trends */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500 text-xl">local_fire_department</span>
                실시간 인기 도구
              </h3>
              <ul className="space-y-3">
                {trendTools.map((tool, idx) => (
                  <motion.li
                    key={tool.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + idx * 0.08, duration: 0.4, ease: 'easeOut' }}
                  >
                    <Link href={`/tools/${tool.id}`} className="flex items-center gap-3 group">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${idx < 3 ? 'bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-900 group-hover:text-white'}`}>
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-sky-600 transition-colors truncate">{tool.name}</p>
                        <p className="text-xs text-slate-400 truncate">{tool.shortDesc}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-xs font-black text-amber-500 shrink-0 ml-auto">
                        <span className="material-symbols-outlined text-sm">star</span>
                        {tool.rating.toFixed(1)}
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Link href="/ranking" className="mt-4 flex items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors pt-4 border-t border-slate-50 dark:border-slate-700">
                전체 랭킹 보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal direction="right" delay={0.35}>
            <div className="bg-linear-to-br from-sky-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-sky-200 dark:shadow-sky-900/30 relative overflow-hidden">
              <motion.div
                className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">AI 실험실 참여하기</h3>
                <p className="text-sky-100 text-sm mb-4 leading-relaxed">직접 써보고 후기를 공유하면 더 많은 사람이 도움 받아요.</p>
                <SpringButton>
                  <Link href="/labs" className="block w-full bg-white text-sky-700 font-bold py-2.5 rounded-lg text-sm hover:bg-sky-50 transition-colors text-center">
                    실험실 구경하기 →
                  </Link>
                </SpringButton>
              </div>
            </div>
          </ScrollReveal>

          {/* Recent Community Posts */}
          {posts.length > 0 && (
            <ScrollReveal direction="right" delay={0.45}>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-500 text-xl">forum</span>
                  인기 커뮤니티 글
                </h3>
                <ul className="space-y-3">
                  {posts.slice(0, 4).map(post => (
                    <li key={post.id}>
                      <Link href={`/community/${post.id}`} className="group block">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">{post.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span>{post.category}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">visibility</span>{post.views}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/community" className="mt-4 flex items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors pt-4 border-t border-slate-50 dark:border-slate-700">
                  커뮤니티 가기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </ScrollReveal>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <ScrollReveal direction="right" delay={0.55}>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-4">인기 카테고리</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <Link key={cat.category} href={`/tools?category=${encodeURIComponent(cat.category)}`}
                      className="text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900 dark:hover:text-sky-300 transition-colors">
                      {cat.category}
                      <span className="ml-1 text-slate-400">{cat.count}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/categories" className="mt-4 flex items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors pt-4 border-t border-slate-50 dark:border-slate-700">
                  전체 카테고리 <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </ScrollReveal>
          )}

        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
          width: max-content;
        }
      ` }} />
    </main>
  );
}
