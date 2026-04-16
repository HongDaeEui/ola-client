"use client";

const API = 'https://ola-backend-psi.vercel.app/api';

interface Props {
  id: string;
  contentUrl: string;
  variant: 'featured' | 'card';
}

export default function ResourceCard({ id, contentUrl, variant }: Props) {
  function handleClick() {
    fetch(`${API}/resources/${id}/read`, { method: 'PATCH' }).catch(() => {});
  }

  if (variant === 'featured') {
    return (
      <a
        href={contentUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-1.5 text-white/90 font-bold text-sm hover:text-white transition-colors group"
      >
        보러 가기
        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
      </a>
    );
  }

  return (
    <a
      href={contentUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex items-center gap-1 text-sky-600 font-bold text-xs hover:text-sky-700 transition-colors group"
    >
      열기
      <span className="material-symbols-outlined text-[15px] group-hover:translate-x-0.5 transition-transform">open_in_new</span>
    </a>
  );
}
