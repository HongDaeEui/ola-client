import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LikeBookmarkButtons } from '@/components/LikeBookmarkButtons';
import { ShareButton } from '@/components/ShareButton';
import { ViewTracker } from '@/components/ViewTracker';
import CopyButton from '../CopyButton';

interface Author {
  username: string;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  toolName: string;
  likes: number;
  views: number;
  author: Author;
}

async function getPrompt(id: string): Promise<Prompt | null> {
  try {
    const res = await fetch(`https://ola-backend-psi.vercel.app/api/prompts/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prompt = await getPrompt(id);

  if (!prompt) notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <ViewTracker type="prompts" id={prompt.id} />
      <div className="max-w-4xl mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-8">
          <Link href="/" className="hover:text-sky-600 transition-colors">홈</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/prompts" className="hover:text-sky-600 transition-colors">Prompts</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-slate-600">{prompt.title}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 p-10 md:p-14 mb-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
                {prompt.toolName}
              </span>
              <span className="text-xs font-bold text-slate-500">#{prompt.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
              {prompt.title}
            </h1>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {prompt.author?.username?.charAt(0) || '?'}
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">@{prompt.author?.username || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-sm font-bold">
                <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                {prompt.likes || 0}
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-sm font-bold">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                {prompt.views || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">

            {/* Prompt Content */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-500">code</span>
                  프롬프트 내용
                </h2>
                <CopyButton
                  text={prompt.content}
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors"
                  label="복사"
                />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 relative">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                  {prompt.content}
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Info */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Info</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">카테고리</span>
                  <span className="font-bold text-slate-900 dark:text-white">#{prompt.category}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">AI 도구</span>
                  <span className="font-bold text-sky-600">{prompt.toolName}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">좋아요</span>
                  <span className="font-bold text-rose-500">{prompt.likes || 0}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">조회수</span>
                  <span className="font-bold text-slate-900 dark:text-white">{prompt.views || 0}</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
              <LikeBookmarkButtons targetType="PROMPT" targetId={prompt.id} initialLikes={prompt.likes} variant="column" />
              <ShareButton
                title={prompt.title}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              />
            </div>

          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <Link href="/prompts" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Prompts 목록으로 돌아가기
          </Link>
        </div>

      </div>
    </div>
  );
}
