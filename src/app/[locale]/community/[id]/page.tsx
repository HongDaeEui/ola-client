import { API_BASE, apiFetch } from '@/lib/api';
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { LikeBookmarkButtons } from '@/components/LikeBookmarkButtons';
import { ShareButton } from '@/components/ShareButton';
import { ViewTracker } from '@/components/ViewTracker';
import CommentSection from './CommentSection';
export const revalidate = 300;


interface Author {
  username: string;
  avatarUrl: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  likes: number;
  views: number;
  createdAt: string;
  author: Author;
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const res = await apiFetch(`${API_BASE}/posts/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  '실천형 노하우': 'bg-sky-50 text-sky-700 border-sky-100',
  '자유게시판': 'bg-slate-50 text-slate-600 border-slate-200',
  '전문 리포트': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  '작품 공유': 'bg-rose-50 text-rose-700 border-rose-100',
};

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  const categoryClass = CATEGORY_COLORS[post.category] ?? 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 lg:pt-32 pb-20 font-['Noto_Sans_KR']">
      <ViewTracker type="posts" id={post.id} />
      <div className="max-w-3xl mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-8">
          <Link href="/" className="hover:text-sky-600 transition-colors">홈</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/community" className="hover:text-sky-600 transition-colors">커뮤니티</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-slate-600 truncate max-w-[200px]">{post.title}</span>
        </div>

        {/* Post Card */}
        <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 overflow-hidden mb-8">

          {/* Header */}
          <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`text-xs font-black px-3 py-1 rounded-full border uppercase tracking-wider ${categoryClass}`}>
                {post.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">{formatDate(post.createdAt)}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold uppercase text-sm">
                  {post.author?.username?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">@{post.author?.username}</p>
                  <p className="text-xs text-slate-400 font-medium">Ola 멤버</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                  <span className="font-bold">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span className="font-bold">{post.views}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12 dark:bg-slate-900">
            {post.imageUrl && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-slate-100">
                <Image src={post.imageUrl} alt={post.title} width={24} height={24} className="w-full max-h-[480px] object-cover" />
              </div>
            )}
            <div className="prose prose-slate max-w-none">
              {post.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-5 last:mb-0 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 md:px-12 py-6 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <LikeBookmarkButtons targetType="POST" targetId={post.id} initialLikes={post.likes} />
            <ShareButton title={post.title} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ml-auto" />
          </div>
        </article>

        {/* Comments */}
        <CommentSection postId={post.id} />

        {/* Back */}
        <div className="mt-8">
          <Link href="/community" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            커뮤니티로 돌아가기
          </Link>
        </div>

      </div>
    </div>
  );
}
