import { API_BASE } from '@/lib/api';
import { ImageResponse } from 'next/og';
import { getFonts } from '@/lib/fonts';
export const revalidate = 300;

export const alt = 'Ola 커뮤니티 게시글 썸네일';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';


async function getPost(id: string) {
  try {
    const res = await fetch(`${API_BASE}/posts/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  const { regular, bold } = await getFonts();

  if (!post) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#0f172a', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
          Ola AI — 게시글을 찾을 수 없습니다.
        </div>
      ),
      { ...size }
    );
  }

  const CATEGORY_COLORS: Record<string, string> = {
    '실천형 노하우': '#38bdf8', // sky
    '자유게시판': '#94a3b8',    // slate
    '전문 리포트': '#818cf8',   // indigo
    '작품 공유': '#fb7185',     // rose
  };
  const catColor = CATEGORY_COLORS[post.category] || '#94a3b8';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a', // slate-900
          backgroundImage: 'radial-gradient(circle at bottom 100%, rgba(56, 189, 248, 0.2), rgba(15, 23, 42, 1) 70%)',
          color: 'white',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'auto' }}>
          <div
            style={{
              display: 'flex',
              padding: '12px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              fontSize: 28,
              fontWeight: 700,
              color: catColor,
            }}
          >
            {post.category}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.2,
              margin: '0 0 24px 0',
              wordBreak: 'keep-all',
              color: 'white',
            }}
          >
            {post.title}
          </h1>
          <p
            style={{
              fontSize: 38,
              lineHeight: 1.4,
              color: '#94a3b8', // slate-400
              maxWidth: '900px',
            }}
          >
            {post.content?.slice(0, 90) + (post.content?.length > 90 ? '...' : '')}
          </p>
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center' }}>
          {post.author?.username && (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 700,
                color: 'white',
                marginRight: '16px'
              }}>
                {post.author.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: 32, color: '#e2e8f0', fontWeight: 700 }}>
                @{post.author.username}
              </div>
            </div>
          )}
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 36, fontWeight: 700, color: '#38bdf8', marginRight: '24px' }}>
            Ola AI
          </div>
          <div style={{ fontSize: 24, color: '#64748b' }}>olalab.kr</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Pretendard', data: regular, style: 'normal', weight: 400 },
        { name: 'Pretendard', data: bold, style: 'normal', weight: 700 },
      ],
    }
  );
}
