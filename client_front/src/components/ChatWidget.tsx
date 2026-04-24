"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';

const QUICK_QUESTIONS = [
  '요즘 핫한 AI 도구 추천해줘',
  '프롬프트 잘 쓰는 법',
  'AI로 이미지 만들기',
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const chatConfig: any = {
    api: '/api/chat',
    streamProtocol: 'text',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: '안녕하세요! Ola AI 비서입니다. 🙌\n어떤 AI 도구나 노하우를 찾고 계신가요?',
        createdAt: new Date(),
      },
    ],
    onError: (error: Error) => {
      console.error('Chat error:', error);
    },
  };

  const { messages, input, handleInputChange, handleSubmit, status, append } = useChat(chatConfig) as any;

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  const showQuickQuestions = messages.length === 1 && !isLoading;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          className="mb-4 w-[340px] h-[520px] max-h-[80vh] flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700"
          style={{ animation: 'chatPopup 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-4 text-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight">Ola AI 비서</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <p className="text-[10px] text-sky-100 font-medium">온라인</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
            {messages.map((msg: any) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                    <span className="material-symbols-outlined text-[12px] text-white">smart_toy</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-sky-500 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                  }`}
                >
                  {String(msg.content || '').split('\n').map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                  <span className="material-symbols-outlined text-[12px] text-white">smart_toy</span>
                </div>
                <div className="bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Quick questions */}
            {showQuickQuestions && (
              <div className="flex flex-col gap-1.5 mt-2">
                {QUICK_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => append({ role: 'user', content: q })}
                    className="text-left text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 rounded-xl px-3 py-2 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                  <span className="material-symbols-outlined text-[12px] text-white">smart_toy</span>
                </div>
                <div className="bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 shadow-sm">
                  {[0, 150, 300].map(delay => (
                    <div key={delay} className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl pl-4 pr-2 py-2 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 dark:focus-within:ring-sky-900 transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="어떤 AI가 필요하신가요?"
                className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-200'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
            <p className="text-center mt-2 text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              Powered by Ola Engine
            </p>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="AI 비서"
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-slate-800' : 'bg-gradient-to-tr from-sky-500 to-indigo-600'
        }`}
        style={{
          boxShadow: isOpen
            ? '0 10px 25px -5px rgba(15,23,42,0.3)'
            : '0 10px 25px -5px rgba(14,165,233,0.5)',
        }}
      >
        <span className={`material-symbols-outlined text-[28px] transition-all duration-300 absolute ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          close
        </span>
        <span className={`material-symbols-outlined text-[28px] transition-all duration-300 absolute ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
          forum
        </span>
        {!isOpen && isHovered && (
          <div className="absolute -top-10 bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
            AI 비서에게 물어보기
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
          </div>
        )}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes chatPopup {
          from { opacity: 0; transform: scale(0.9) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      ` }} />
    </div>
  );
}
