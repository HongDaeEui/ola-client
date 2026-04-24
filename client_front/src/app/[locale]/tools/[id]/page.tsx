import { API_BASE, apiFetch } from '@/lib/api';
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { LikeBookmarkButtons } from '@/components/LikeBookmarkButtons';
import { ShareButton } from '@/components/ShareButton';
import type { Metadata } from 'next';
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await apiFetch(`${API_BASE}/tools/${id}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Tool Not Found — Ola' };
    const tool = await res.json();
    return {
      title: `${tool.name} — Ola AI Tools`,
      description: tool.shortDesc || tool.description?.slice(0, 160),
      openGraph: {
        title: `${tool.name} — Ola AI Tools`,
        description: tool.shortDesc,
        type: 'website',
      },
    };
  } catch {
    return { title: 'Ola AI Tools' };
  }
}

interface RelatedLab {
  id: string;
  title: string;
  emoji: string | null;
  difficulty: string | null;
  category: string;
  likes: number;
  author: {
    username: string;
    avatarUrl: string | null;
  };
}

interface Tool {
  id: string;
  name: string;
  description: string;
  shortDesc: string;
  category: string;
  developer?: string;
  pricingModel: string;
  rating: number;
  tags: string[];
  launchUrl?: string;
  iconUrl?: string;
  coverUrl?: string;
  isFeatured?: boolean;
  status?: string;
  createdAt?: string;
  likes: number;
  relatedLabs?: RelatedLab[];
}


async function getTool(id: string): Promise<Tool | null> {
  try {
    const res = await apiFetch(`${API_BASE}/tools/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getRelatedTools(currentId: string): Promise<Tool[]> {
  try {
    const res = await apiFetch(`${API_BASE}/tools`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const all: Tool[] = await res.json();
    return all.filter(t => t.id !== currentId).slice(0, 4);
  } catch {
    return [];
  }
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <span
          key={`full-${i}`}
          className="material-symbols-outlined text-amber-400 text-[22px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
      {hasHalf && (
        <span
          className="material-symbols-outlined text-amber-400 text-[22px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star_half
        </span>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span
          key={`empty-${i}`}
          className="material-symbols-outlined text-slate-200 text-[22px]"
        >
          star
        </span>
      ))}
    </div>
  );
}

function InfoCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        <span className="material-symbols-outlined text-[20px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tool, relatedTools] = await Promise.all([
    getTool(id),
    getRelatedTools(id),
  ]);

  if (!tool) notFound();

  const ratingNum = typeof tool.rating === 'string' ? parseFloat(tool.rating) : tool.rating;

  return (
    <div className="min-h-screen bg-slate-50 font-['Noto_Sans_KR']">

      {/* ── Hero Section with gradient background ── */}
      <section className="relative pt-28 lg:pt-32 pb-16 overflow-hidden">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400/80 font-medium mb-10">
            <Link href="/" className="hover:text-white transition-colors">홈</Link>
            <span className="material-symbols-outlined text-[14px] text-slate-500">chevron_right</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span className="material-symbols-outlined text-[14px] text-slate-500">chevron_right</span>
            <span className="text-sky-300">{tool.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Icon */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-sky-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
                {tool.iconUrl ? (
                  <Image src={tool.iconUrl} alt={tool.name} width={24} height={24} className="w-20 h-20 rounded-xl object-cover" />
                ) : (
                  <span className="text-white font-black text-4xl uppercase tracking-tighter">
                    {tool.name.substring(0, 2)}
                  </span>
                )}
              </div>
            </div>

            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="text-[11px] font-black px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wider">
                  {tool.category}
                </span>
                {tool.isFeatured && (
                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    Featured
                  </span>
                )}
                <span className="text-[11px] font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                  {tool.status === 'COMING_SOON' ? '출시 예정' : '이용 가능'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 leading-[1.15]">
                {tool.name}
              </h1>
              <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
                {tool.shortDesc}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-5">
                <StarRating rating={ratingNum} />
                <span className="font-extrabold text-white text-xl">{ratingNum.toFixed(1)}</span>
                <span className="text-slate-400 text-sm font-medium">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="max-w-5xl mx-auto px-6 -mt-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Column: Main Content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-lg font-extrabold text-slate-900 mb-5 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sky-600 text-[18px]">description</span>
                </span>
                도구 상세 설명
              </h2>
              <p className="text-slate-600 leading-[1.85] text-[15px]">
                {tool.description}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard icon="category" label="카테고리" value={tool.category} color="bg-sky-500" />
              <InfoCard icon="payments" label="요금제" value={tool.pricingModel || 'FREE'} color="bg-emerald-500" />
              <InfoCard icon="star" label="평점" value={`${ratingNum.toFixed(1)} / 5.0`} color="bg-amber-500" />
              <InfoCard icon="verified" label="상태" value={tool.status === 'COMING_SOON' ? '출시 예정' : '활성'} color="bg-purple-500" />
            </div>

            {/* Tags Section */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <h2 className="text-lg font-extrabold text-slate-900 mb-5 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-violet-600 text-[18px]">label</span>
                  </span>
                  관련 태그
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {tool.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-sm font-bold text-sky-600 bg-sky-50 border border-sky-100 px-4 py-2 rounded-xl hover:bg-sky-100 hover:border-sky-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-rose-500 text-[18px]">explore</span>
                  </span>
                  다른 AI 도구도 둘러보세요
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedTools.map((rt) => (
                    <Link
                      key={rt.id}
                      href={`/tools/${rt.id}`}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-md hover:shadow-sky-50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-600 font-bold text-base uppercase group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                        {rt.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm text-slate-800 group-hover:text-sky-600 transition-colors truncate">
                          {rt.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {rt.shortDesc}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="material-symbols-outlined text-amber-400 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-[11px] font-bold text-slate-500">{typeof rt.rating === 'number' ? rt.rating.toFixed(1) : rt.rating}</span>
                          <span className="text-[10px] text-slate-400 ml-1 bg-slate-100 px-1.5 py-0.5 rounded font-medium truncate">
                            {rt.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {/* Related Labs Section */}
            {tool.relatedLabs && tool.relatedLabs.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm mt-8">
                <h2 className="text-lg font-extrabold text-slate-900 mb-2 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">science</span>
                  </span>
                  이 도구가 활용된 커뮤니티 투토리얼
                </h2>
                <p className="text-slate-500 text-sm mb-6 ml-10">
                  {tool.name}의 강력한 기능을 활용해 다른 유저들이 만들어낸 실험 결과를 확인해보세요.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.relatedLabs.map((lab) => {
                    const seed = parseInt((lab.id || '1').split('-')[0], 16) % 10000 || lab.likes || 1;
                    return (
                      <Link
                        key={lab.id}
                        href={`/labs/${lab.id}`}
                        className="group flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-emerald-100/50 hover:border-emerald-300 transition-all duration-300"
                      >
                        {/* Compact Banner */}
                        <div className={`h-28 relative p-4 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${
                          [
                            'from-sky-500 to-indigo-600',
                            'from-rose-500 to-fuchsia-600',
                            'from-emerald-400 to-teal-600',
                            'from-amber-400 to-orange-500',
                            'from-violet-500 to-purple-700',
                            'from-pink-500 to-rose-500'
                          ][seed % 6]
                        } group-hover:shadow-[inset_0_0_80px_rgba(0,0,0,0.3)] transition-shadow duration-700`}>
                          <img 
                            src={`https://api.dicebear.com/9.x/shapes/svg?seed=${lab.title}&backgroundColor=transparent`} 
                            alt={lab.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700 ease-in-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                          <div className="relative z-10 flex justify-between items-start">
                            <span className="text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-sm uppercase">
                              {lab.category}
                            </span>
                            {lab.difficulty && (
                              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-900/40 text-white backdrop-blur-md border border-white/10 flex items-center gap-1 shadow-sm">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  lab.difficulty === '입문' ? 'bg-emerald-400' :
                                  lab.difficulty === '중급' ? 'bg-amber-400' : 'bg-rose-400'
                                }`} />
                                {lab.difficulty}
                              </span>
                            )}
                          </div>
                          <div className="relative z-10 font-bold text-white text-base leading-tight mt-auto flex items-center gap-2 group-hover:-translate-y-1 transition-transform duration-500">
                            {lab.emoji && <span className="text-xl drop-shadow-md">{lab.emoji}</span>}
                            <span className="drop-shadow-md line-clamp-1">{lab.title}</span>
                          </div>
                        </div>
                        {/* Compact Content */}
                        <div className="p-4 flex flex-col flex-1">
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-500">
                              <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-600 text-[10px] shadow-sm uppercase overflow-hidden">
                                {lab.author.avatarUrl ? (
                                  <Image src={lab.author.avatarUrl} alt={lab.author.username} width={24} height={24} className="w-full h-full object-cover" />
                                ) : (
                                  lab.author.username.charAt(0)
                                )}
                              </div>
                              <span className="text-xs font-bold truncate max-w-[100px]">@{lab.author.username}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-500 transition-colors">
                              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                              <span className="text-xs font-bold">{lab.likes}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: Sidebar ── */}
          <div className="space-y-6">

            {/* CTA: Visit Site */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
              {tool.launchUrl && (
                <a
                  href={tool.launchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-slate-900 to-slate-700 text-white py-3.5 rounded-2xl font-black text-sm hover:from-slate-800 hover:to-slate-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  공식 사이트 방문
                </a>
              )}
              <LikeBookmarkButtons
                targetType="TOOL"
                targetId={tool.id}
                initialLikes={tool.likes ?? 0}
                variant="column"
              />
              <ShareButton
                title={tool.name}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-600 border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
              />
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-5">Quick Info</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">category</span>
                    카테고리
                  </span>
                  <span className="text-sm font-bold text-slate-800 text-right max-w-[55%] truncate">{tool.category}</span>
                </li>
                <li className="border-t border-slate-50 pt-4 flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">payments</span>
                    요금제
                  </span>
                  <span className="text-sm font-bold text-slate-800 text-right max-w-[55%] truncate">{tool.pricingModel || 'FREE'}</span>
                </li>
                <li className="border-t border-slate-50 pt-4 flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    평점
                  </span>
                  <span className="text-sm font-bold text-amber-500">★ {ratingNum.toFixed(1)}</span>
                </li>
                {tool.developer && (
                  <li className="border-t border-slate-50 pt-4 flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">business</span>
                      개발사
                    </span>
                    <span className="text-sm font-bold text-slate-800">{tool.developer}</span>
                  </li>
                )}
                {tool.createdAt && (
                  <li className="border-t border-slate-50 pt-4 flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">calendar_today</span>
                      등록일
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {new Date(tool.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Share Card */}
            <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-6 shadow-lg shadow-sky-100 text-white relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h3 className="font-black text-lg mb-2">이 도구가 마음에 드셨나요?</h3>
                <p className="text-sky-100 text-sm leading-relaxed mb-4">
                  커뮤니티에 공유하고 다른 사람들의 의견도 들어보세요.
                </p>
                <Link
                  href="/community"
                  className="w-full bg-white text-sky-700 py-3 rounded-xl font-bold text-sm hover:bg-sky-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">forum</span>
                  커뮤니티에서 토론하기
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-14">
          <Link href="/tools" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors group">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Tools 목록으로 돌아가기
          </Link>
        </div>
      </section>
    </div>
  );
}
