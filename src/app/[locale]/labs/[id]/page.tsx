import { API_BASE } from '@/lib/api';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { LikeBookmarkButtons } from '@/components/LikeBookmarkButtons';
import { WorkshopButton, MeetupCreateBridge } from '@/components/WorkshopClient';
import type { Metadata } from 'next';
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_BASE}/labs/${id}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Lab Not Found — Ola' };
    const lab = await res.json();
    const title = `${lab.emoji ? lab.emoji + ' ' : ''}${lab.title} — Ola Labs`;
    return {
      title,
      description: lab.description?.slice(0, 160),
      openGraph: {
        title,
        description: lab.description?.slice(0, 160),
        type: 'website',
      },
    };
  } catch {
    return { title: 'Ola Labs' };
  }
}

interface Author {
  username: string;
  avatarUrl?: string;
}

interface Lab {
  id: string;
  title: string;
  description: string;
  content?: string;
  difficulty?: string;
  emoji?: string;
  metric: string;
  category: string;
  stack: string[];
  color: string;
  likes: number;
  author: Author;
  createdAt?: string;
}


async function getLab(id: string): Promise<Lab | null> {
  try {
    const res = await fetch(`${API_BASE}/labs/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getRelatedLabs(currentId: string, category: string): Promise<Lab[]> {
  try {
    const res = await fetch(`${API_BASE}/labs`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const all: Lab[] = await res.json();
    const same = all.filter(l => l.id !== currentId && l.category === category);
    return (same.length >= 2 ? same : all.filter(l => l.id !== currentId)).slice(0, 3);
  } catch {
    return [];
  }
}

const DIFFICULTY_STYLE: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  '입문': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', label: '🟢 입문' },
  '중급': { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   label: '🟡 중급' },
  '고급': { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400',     label: '🔴 고급' },
};

/** 본문을 ## 헤딩 단위로 Step 카드로 파싱 */
function parseContent(content: string) {
  const sections = content.split(/\n(?=##\s)/);
  return sections.map((s) => {
    const lines = s.trim().split('\n');
    const heading = lines[0].replace(/^##\s*/, '').trim();
    const body = lines.slice(1).join('\n').trim();
    return { heading, body };
  }).filter(s => s.heading);
}

export default async function LabDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lab = await getLab(id);

  if (!lab) notFound();

  const relatedLabs = await getRelatedLabs(id, lab.category);

  const diff = lab.difficulty ? DIFFICULTY_STYLE[lab.difficulty] ?? DIFFICULTY_STYLE['입문'] : null;
  const steps = lab.content ? parseContent(lab.content) : [];

  return (
    <div className="min-h-screen bg-slate-50 font-['Noto_Sans_KR']">

      {/* ── Hero ── */}
      <section className={`relative pt-28 lg:pt-32 pb-20 bg-gradient-to-br ${lab.color || 'from-slate-700 to-slate-900'} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-10 -left-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 font-medium mb-10">
            <Link href="/" className="hover:text-white transition-colors">홈</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/labs" className="hover:text-white transition-colors">Labs</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-white/90 line-clamp-1">{lab.emoji} {lab.title}</span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">science</span>
              Ola Labs
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
              {lab.category}
            </span>
            {diff && (
              <span className={`${diff.bg} ${diff.text} text-xs font-black px-3 py-1.5 rounded-full`}>
                {diff.label}
              </span>
            )}
          </div>

          {/* Title and Workshop Button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
                {lab.emoji && <span className="mr-3">{lab.emoji}</span>}
                {lab.title}
              </h1>
              <p className="text-white/80 text-lg font-medium max-w-2xl leading-relaxed">
                {lab.description}
              </p>
            </div>
            
            {/* Workshop Button */}
            <div className="shrink-0 pb-1">
              <WorkshopButton 
                labId={lab.id} 
                title={lab.title} 
                steps={steps} 
                emoji={lab.emoji} 
                color={lab.color} 
              />
            </div>
          </div>

          {/* Meta footer */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-sm uppercase">
                {lab.author?.username?.charAt(0) || '?'}
              </div>
              <span className="text-white/90 font-bold text-sm">@{lab.author?.username || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/70 text-sm font-bold">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              {lab.likes.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-white/70 text-sm font-bold">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              {(lab.likes + 1024).toLocaleString()}
            </div>
            {lab.createdAt && (
              <div className="text-white/60 text-sm font-medium">
                {new Date(lab.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="max-w-5xl mx-auto px-6 mt-10 md:mt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Steps ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step-by-step guide */}
            {steps.length > 0 ? (
              <div className="space-y-5">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base font-extrabold text-slate-900 mb-2 leading-snug">
                          {step.heading}
                        </h2>
                        <p className="text-sm text-slate-600 leading-[1.8] whitespace-pre-line">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sky-600 text-[18px]">description</span>
                  </span>
                  실험 개요
                </h2>
                <p className="text-slate-600 leading-relaxed">{lab.description}</p>
              </div>
            )}

            {/* Metric Highlight */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-7 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[22px]">bolt</span>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-100">핵심 성과 지표</span>
                </div>
                <p className="text-2xl md:text-3xl font-black">{lab.metric}</p>
              </div>
            </div>

            {/* Related Labs */}
            {relatedLabs.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm">
                <h2 className="text-lg font-extrabold text-slate-900 mb-5 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-rose-500 text-[18px]">explore</span>
                  </span>
                  이런 실험도 해보세요
                </h2>
                <div className="space-y-3">
                  {relatedLabs.map((r) => (
                    <Link
                      key={r.id}
                      href={`/labs/${r.id}`}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-md hover:shadow-sky-50 transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color || 'from-slate-400 to-slate-600'} flex-shrink-0 flex items-center justify-center text-2xl`}>
                        {r.emoji || '🧪'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
                          {r.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{r.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {r.difficulty && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLE[r.difficulty]?.bg ?? 'bg-slate-100'} ${DIFFICULTY_STYLE[r.difficulty]?.text ?? 'text-slate-600'}`}>
                              {DIFFICULTY_STYLE[r.difficulty]?.label ?? r.difficulty}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-medium">{r.category}</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-sky-400 transition-colors text-[20px] flex-shrink-0">
                        arrow_forward
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="space-y-5">

            {/* View Actions */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <LikeBookmarkButtons
                targetType="LAB"
                targetId={lab.id}
                initialLikes={lab.likes}
                variant="column"
              />
            </div>

            {/* Meetup Creation Pipeline CTA */}
            <MeetupCreateBridge labId={lab.id} title={lab.title} emoji={lab.emoji || ''} />

            {/* Tech Stack */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Tech Stack Used</h3>
              <div className="flex flex-wrap gap-2">
                {lab.stack?.map((tool, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Quick Info</h3>
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">category</span>
                    카테고리
                  </span>
                  <span className="font-bold text-slate-800 text-right">{lab.category}</span>
                </li>
                {diff && (
                  <li className="border-t border-slate-50 pt-3.5 flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">signal_cellular_alt</span>
                      난이도
                    </span>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${diff.bg} ${diff.text}`}>
                      {diff.label}
                    </span>
                  </li>
                )}
                <li className="border-t border-slate-50 pt-3.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">bolt</span>
                    핵심 성과
                  </span>
                  <span className="font-bold text-emerald-600 text-right text-xs max-w-[55%]">{lab.metric}</span>
                </li>
                <li className="border-t border-slate-50 pt-3.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    좋아요
                  </span>
                  <span className="font-bold text-slate-800">{lab.likes.toLocaleString()}</span>
                </li>
              </ul>
            </div>

            {/* CTA: Share */}
            <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-sky-100">
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <h3 className="font-black text-base mb-1.5">직접 나도 해봤어요!</h3>
                <p className="text-sky-100 text-xs leading-relaxed mb-4">
                  실험 결과를 커뮤니티에 공유하고 다른 멤버들과 이야기 나눠보세요.
                </p>
                <Link
                  href="/community/write"
                  className="w-full bg-white text-sky-700 py-2.5 rounded-xl font-bold text-sm hover:bg-sky-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  후기 작성하기
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="mt-12">
          <Link href="/labs" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors group">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Labs 목록으로 돌아가기
          </Link>
        </div>
      </section>
    </div>
  );
}
