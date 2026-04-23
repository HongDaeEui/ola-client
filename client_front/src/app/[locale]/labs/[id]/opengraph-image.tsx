import { API_BASE } from '@/lib/api';
import { ImageResponse } from 'next/og';
import { getFonts } from '@/lib/fonts';
export const revalidate = 300;

export const alt = 'Ola Labs 실험실 공유';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';


async function getLab(id: string) {
  try {
    const res = await fetch(`${API_BASE}/labs/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: { id: string } }) {
  const lab = await getLab(params.id);
  const { regular, bold } = await getFonts();

  if (!lab) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#0f172a', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
          Ola Labs — 실험을 찾을 수 없습니다.
        </div>
      ),
      { ...size }
    );
  }

  // 난이도 색상
  const diffColors: Record<string, string> = {
    '입문': '#10b981', // emerald
    '중급': '#f59e0b', // amber
    '고급': '#ef4444', // red
  };
  const diffColor = lab.difficulty ? (diffColors[lab.difficulty] || '#3b82f6') : '#3b82f6';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a', // slate-900
          backgroundImage: 'radial-gradient(circle at top right, rgba(14, 165, 233, 0.4), rgba(15, 23, 42, 1) 70%)',
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
              color: '#38bdf8', // sky-400
              marginRight: '20px',
            }}
          >
            🧪 Labs
          </div>
          <div
            style={{
              display: 'flex',
              padding: '12px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              fontSize: 28,
              fontWeight: 700,
              color: 'white',
              marginRight: '20px',
            }}
          >
            {lab.category}
          </div>
          {lab.difficulty && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 28,
                fontWeight: 700,
                color: diffColor,
              }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: diffColor, marginRight: '12px' }} />
              {lab.difficulty}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            {lab.emoji && (
              <span style={{ fontSize: 96, marginRight: '32px' }}>
                {lab.emoji}
              </span>
            )}
            <h1
              style={{
                fontSize: 76,
                fontWeight: 700,
                lineHeight: 1.2,
                margin: 0,
                wordBreak: 'keep-all',
                color: 'white',
                maxWidth: lab.emoji ? '900px' : '1040px',
              }}
            >
              {lab.title}
            </h1>
          </div>
          <p
            style={{
              fontSize: 38,
              lineHeight: 1.4,
              color: '#94a3b8', // slate-400
              maxWidth: '900px',
            }}
          >
            {lab.description?.slice(0, 80) + (lab.description?.length > 80 ? '...' : '')}
          </p>
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center' }}>
          {lab.author?.username && (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
             <div style={{
               padding: '8px 16px',
               backgroundColor: 'rgba(255,255,255,0.1)',
               borderRadius: '16px',
               fontSize: 28,
               color: '#e2e8f0',
               fontWeight: 700
             }}>
               @{lab.author.username}
             </div>
            </div>
          )}
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
