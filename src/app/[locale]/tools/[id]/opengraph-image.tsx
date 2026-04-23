import { API_BASE } from '@/lib/api';
import { ImageResponse } from 'next/og';
import { getFonts } from '@/lib/fonts';
export const revalidate = 300;

export const alt = 'Ola AI 리포트 썸네일';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';


async function getTool(id: string) {
  try {
    const res = await fetch(`${API_BASE}/tools/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: { id: string } }) {
  const tool = await getTool(params.id);
  const { regular, bold } = await getFonts();

  if (!tool) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#0a0a0a',
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
          }}
        >
          Ola AI — 도구를 찾을 수 없습니다.
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(circle at 80% -20%, rgba(139, 92, 246, 0.4) 0%, rgba(0, 0, 0, 1) 60%)',
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
              color: '#a78bfa',
              marginRight: '20px',
            }}
          >
            {tool.category || 'AI 도구'}
          </div>
          {tool.rating && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 28,
                fontWeight: 700,
                color: '#fbbf24',
              }}
            >
              ★ {tool.rating.toFixed(1)}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '24px',
              wordBreak: 'keep-all',
              backgroundImage: 'linear-gradient(to right, #ffffff, #a8a29e)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {tool.name}
          </h1>
          <p
            style={{
              fontSize: 42,
              lineHeight: 1.4,
              color: '#d6d3d1',
              maxWidth: '900px',
            }}
          >
            {tool.shortDesc || tool.description?.slice(0, 80) + '...'}
          </p>
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: 'white', marginRight: '24px' }}>
            Ola AI
          </div>
          <div style={{ fontSize: 24, color: '#a8a29e' }}>olalab.kr</div>
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
