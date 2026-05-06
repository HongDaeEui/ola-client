"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';

interface Step {
  heading: string;
  body: string;
}

interface WorkshopProps {
  labId: string;
  title: string;
  steps: Step[];
  emoji?: string;
  color?: string;
}

// ── Inline markdown: **bold** only
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-black">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Copy-able code block
function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 my-4">
      {/* header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/60" />
            <span className="w-3 h-3 rounded-full bg-amber-400/60" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/60" />
          </div>
          {label && (
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</span>
          )}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all bg-white/5 hover:bg-white/10 border border-white/10"
        >
          <span className="material-symbols-outlined text-[14px]">{copied ? 'check_circle' : 'content_copy'}</span>
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
      {/* code */}
      <pre className="p-5 text-sm font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap break-all bg-slate-900/80">
        {code}
      </pre>
    </div>
  );
}

// ── Render a non-code text segment into paragraphs, bullets, dividers
function TextSegment({ text }: { text: string }) {
  if (!text.trim()) return null;

  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="space-y-2 my-3">
        {listItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-slate-200">
            <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
            <span className="leading-relaxed text-base">{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (trimmed === '---') {
      flushList();
      nodes.push(<hr key={`hr-${i}`} className="border-white/10 my-4" />);
    } else if (trimmed.startsWith('- ')) {
      listItems.push(trimmed.slice(2));
    } else if (trimmed.startsWith('| ') || trimmed.startsWith('|-')) {
      // Table row — render as simple text row
      flushList();
      const cells = trimmed.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length > 0 && !trimmed.match(/^[\|\- ]+$/)) {
        nodes.push(
          <div key={`tr-${i}`} className="flex flex-wrap gap-2 my-1">
            {cells.map((cell, j) => (
              <span key={j} className="bg-white/5 border border-white/10 text-slate-300 text-sm px-3 py-1 rounded-lg">
                {renderInline(cell)}
              </span>
            ))}
          </div>
        );
      }
    } else if (trimmed !== '') {
      flushList();
      nodes.push(
        <p key={`p-${i}`} className="text-slate-200 text-base md:text-lg leading-relaxed my-1">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushList();
  return <>{nodes}</>;
}

// ── Main body renderer: splits on code fences
function StepBody({ body }: { body: string }) {
  const parts = body.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-1">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          // Extract optional language label from first line
          const firstNewline = part.indexOf('\n');
          const langLine = part.slice(3, firstNewline).trim();
          const code = part.slice(firstNewline + 1).replace(/```$/, '').trim();
          return (
            <CodeBlock
              key={i}
              code={code}
              label={langLine || 'prompt'}
            />
          );
        }
        return <TextSegment key={i} text={part} />;
      })}
    </div>
  );
}

// ── Workshop button + full-screen modal
export function WorkshopButton({ steps, title, emoji, color }: WorkshopProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentStep(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, steps.length]);

  // Reset step when reopening
  const open = () => { setCurrentStep(0); setIsOpen(true); };

  if (steps.length === 0) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <button
        onClick={open}
        className="group relative flex items-center justify-center gap-2 bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-md text-white border border-white/20 px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-wide transition-all shadow-xl hover:shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-r from-sky-400/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="material-symbols-outlined text-[20px] relative z-10 text-sky-300 group-hover:scale-110 transition-transform">tv_signin</span>
        <span className="relative z-10 drop-shadow-sm">따라하기 (모임 모드)</span>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-2xl text-white flex flex-col font-['Noto_Sans_KR'] overflow-hidden"
            >
              {/* ── Background Effects ── */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
              </div>

              {/* ── Progress bar (Top) ── */}
              <div className="h-1 w-full shrink-0 bg-white/5 relative z-20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className={`h-full bg-linear-to-r ${color || 'from-sky-400 to-indigo-500'}`}
                />
              </div>

              {/* ── Top bar ── */}
              <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/40 shrink-0 relative z-10 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0 drop-shadow-md">{emoji || '🧪'}</span>
                  <span className="font-extrabold text-white/90 text-sm truncate hidden sm:block tracking-wide">{title}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {/* Step counter pills */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentStep(i)}
                        title={steps[i].heading}
                        className={`transition-all rounded-full ${
                          i === currentStep
                            ? 'w-8 h-2 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                            : i < currentStep
                            ? 'w-2 h-2 bg-sky-400/40 hover:bg-sky-400/60'
                            : 'w-2 h-2 bg-white/10 hover:bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="bg-white/10 px-3 py-1 rounded-full border border-white/5 text-slate-300 text-xs font-black tabular-nums tracking-widest">
                    <span className="text-white">{currentStep + 1}</span> / {steps.length}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/5 text-slate-300 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </div>

              {/* ── Slide content ── */}
              <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
                <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      {/* Step badge */}
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-sky-300 font-black text-[10px] tracking-[0.25em] uppercase border border-sky-400/20 bg-sky-400/10 px-4 py-1.5 rounded-full shadow-inner">
                          Step {currentStep + 1}
                        </span>
                        <span className="text-slate-400 text-xs font-medium tracking-wide">{currentStep + 1} / {steps.length} 단계</span>
                      </div>

                      {/* Heading */}
                      <h2 className={`font-extrabold leading-tight tracking-tight mb-10 text-white drop-shadow-xl ${
                        step.heading.length > 30 ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'
                      }`}>
                        {step.heading}
                      </h2>

                      {/* Body */}
                      <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
                        <StepBody body={step.body} />
                      </div>

                      {/* Keyboard hint (first step only) */}
                      {currentStep === 0 && (
                        <motion.p 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                          className="text-center text-slate-500 text-xs mt-8 font-medium tracking-widest uppercase"
                        >
                          ← → 키 또는 하단 버튼으로 이동
                        </motion.p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Bottom nav ── */}
              <div className="h-24 border-t border-white/10 flex items-center justify-between px-6 md:px-12 bg-slate-900/80 backdrop-blur-2xl shrink-0 relative z-20">
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 0}
                  className="group flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-slate-300 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  이전
                </button>

                {/* Center: step title preview */}
                <div className="hidden md:block text-center flex-1 mx-8">
                  {currentStep < steps.length - 1 && (
                    <motion.p 
                      key={`next-${currentStep}`}
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className="text-slate-400 text-sm font-medium truncate flex items-center justify-center gap-2"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Next</span>
                      {steps[currentStep + 1].heading}
                    </motion.p>
                  )}
                </div>

                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm bg-white text-slate-900 hover:bg-sky-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105"
                  >
                    다음 단계
                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="group relative flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm bg-linear-to-r from-emerald-400 to-teal-500 text-white hover:from-emerald-300 hover:to-teal-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="material-symbols-outlined text-[20px] relative z-10 group-hover:rotate-12 transition-transform">celebration</span>
                    <span className="relative z-10">완료! 닫기</span>
                  </button>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export function MeetupCreateBridge({ labId, title, emoji }: Omit<WorkshopProps, 'steps' | 'color'>) {
  return (
    <div className="bg-linear-to-br from-violet-600 to-fuchsia-600 rounded-3xl p-7 text-white relative overflow-hidden shadow-lg shadow-violet-200 group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[24px] text-fuchsia-200">groups</span>
          <span className="text-[11px] font-black uppercase tracking-widest text-fuchsia-200">스터디 모임</span>
        </div>
        <h3 className="font-extrabold text-lg mb-2 leading-snug text-balance">
          이 튜토리얼을 주제로<br />사람들과 모임을 열어보세요!
        </h3>
        <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">
          버튼 클릭 한번으로 지정 교재가 세팅된 모임을 생성합니다.
        </p>
        <Link
          href={`/meetups/new?referenceLabId=${labId}&refTitle=${encodeURIComponent(title)}&refEmoji=${encodeURIComponent(emoji || '')}`}
          className="w-full bg-white text-violet-700 py-3 rounded-xl font-bold text-[15px] hover:bg-fuchsia-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          원클릭 모임 개설하기
        </Link>
      </div>
    </div>
  );
}
