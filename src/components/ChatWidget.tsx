// @ts-nocheck
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: '안녕하세요! Ola AI 비서입니다. 🙌\n어떤 AI 도구나 노하우를 찾고 계신가요?',
      },
    ],
  });

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    if (isOpen) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 입력 중(조합 중)일 때 엔터키 처리를 무시하여 중복 전송 방지
    if (e.nativeEvent.isComposing) return;
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 챗봇 팝업 창 */}
      {isOpen && (
        <div 
          className="mb-4 w-[340px] h-[500px] max-h-[80vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transition-all duration-300 ease-out origin-bottom-right"
          style={{ animation: 'chatPopup 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight">Ola AI 비서</h3>
                <p className="text-[10px] text-sky-100 font-medium">대기중 • UI 디자인 버전</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* 대화 영역 (스크롤) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-sky-500 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                    }
                  `}
                >
                  {msg.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            
            {/* 타이핑 효과 */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* 인풋 영역 */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form 
              onSubmit={handleSubmit}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-2 py-2 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100 transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="어떤 AI가 필요하신가요?"
                className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-200' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Powered by Ola Engine</span>
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-slate-800' : 'bg-gradient-to-tr from-sky-500 to-indigo-600'
        }`}
        style={{
          boxShadow: isOpen 
            ? '0 10px 25px -5px rgba(15, 23, 42, 0.3)' 
            : '0 10px 25px -5px rgba(14, 165, 233, 0.5)'
        }}
      >
        <span 
          className={`material-symbols-outlined text-[28px] transition-all duration-300 ${
            isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
          style={{ position: 'absolute' }}
        >
          forum
        </span>
        <span 
          className={`material-symbols-outlined text-[28px] transition-all duration-300 ${
            isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
          style={{ position: 'absolute' }}
        >
          close
        </span>
        
        {/* 호버 시 툴팁 느낌의 미니 뱃지 */}
        {!isOpen && isHovered && (
          <div className="absolute -top-10 bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap animate-fade-in-up">
            AI 비서에게 물어보기
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
          </div>
        )}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes chatPopup {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out forwards;
        }
      `}} />
    </div>
  );
}
