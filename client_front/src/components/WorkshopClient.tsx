"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
export const runtime = "edge";
export const revalidate = 300;

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

export function WorkshopButton({ steps, title, emoji, color }: WorkshopProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'Enter') {
        setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        setCurrentStep((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, steps.length]);

  if (steps.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center justify-center gap-2 bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-md text-white border border-white/20 px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-wide transition-all shadow-xl hover:shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="material-symbols-outlined text-[20px] relative z-10 text-sky-300 group-hover:scale-110 transition-transform">tv_signin</span>
        <span className="relative z-10 drop-shadow-sm">따라하기 (모임 모드)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col font-['Noto_Sans_KR'] overflow-hidden">
          {/* Top Bar for Presentation */}
          <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl border border-white/10">
                {emoji || '🧪'}
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-white/90">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <span className="text-white">{currentStep + 1}</span> / {steps.length}
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-white/5 w-full shrink-0">
            <div 
              className={`h-full bg-gradient-to-r ${color || 'from-sky-400 to-indigo-500'} transition-all duration-300 ease-out`}
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Main Slide Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-y-auto">
            {/* Background elements */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br ${color || 'from-sky-500 to-indigo-600'} opacity-10 blur-[120px] pointer-events-none rounded-full`} />

            <div className="w-full max-w-5xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
              <span className="inline-block text-sky-400 font-black text-xl mb-6 tracking-widest uppercase border border-sky-400/30 bg-sky-400/10 px-5 py-2 rounded-full">
                Step {currentStep + 1}
              </span>
              
              <h2 className="text-5xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight mb-10 text-white drop-shadow-xl text-balance">
                {steps[currentStep].heading}
              </h2>
              
              <div className="text-xl lg:text-2xl text-slate-300 font-medium leading-relaxed whitespace-pre-line bg-white/5 border border-white/10 p-10 lg:p-14 rounded-[2rem] shadow-2xl backdrop-blur-md">
                {steps[currentStep].body}
              </div>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="h-28 border-t border-white/10 flex items-center justify-between px-12 bg-slate-900/50 backdrop-blur-xl shrink-0">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
              className="flex items-center gap-3 px-6 py-4 rounded-full font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              이전 단계
            </button>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`w-3 h-3 rounded-full transition-all ${currentStep === i ? 'bg-sky-400 scale-125' : 'bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={currentStep === steps.length - 1}
              className="flex items-center gap-3 px-6 py-4 rounded-full font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed bg-white text-slate-900 hover:bg-sky-50 transition-colors"
            >
              다음 단계
              <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function MeetupCreateBridge({ labId, title, emoji }: Omit<WorkshopProps, 'steps' | 'color'>) {
  return (
    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl p-7 text-white relative overflow-hidden shadow-lg shadow-violet-200 group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[24px] text-fuchsia-200">groups</span>
          <span className="text-[11px] font-black uppercase tracking-widest text-fuchsia-200">스터디 모임</span>
        </div>
        <h3 className="font-extrabold text-lg mb-2 leading-snug text-balance">
          이 튜토리얼을 주제로<br/>사람들과 모임을 열어보세요!
        </h3>
        <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">
          버튼 클릭 한번으로 지정 교재가 세팅된 모임을 생성합니다.
        </p>
        <Link
          href={`/meetups/new?referenceLabId=${labId}&refTitle=${encodeURIComponent(title)}&refEmoji=${encodeURIComponent(emoji || '')}`}
          className="w-full bg-white text-violet-700 py-3 rounded-xl font-bold text-[15px] hover:bg-fuchsia-50 transition-colors flex items-center justify-center gap-2 shadow-sm relative overflow-hidden"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          원클릭 모임 개설하기
        </Link>
      </div>
    </div>
  );
}
