/**
 * 중앙 집중식 API Base URL
 * 모든 컴포넌트에서 이 상수를 import하여 사용합니다.
 * - 환경변수 NEXT_PUBLIC_API_URL이 설정되어 있으면 해당 값 사용
 * - 미설정 시 Render 배포 URL을 기본값으로 사용
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://ola-backend-9f03.onrender.com/api';

export async function apiFetch(url: string, init: RequestInit & { next?: object } = {}): Promise<Response> {
  const { next, ...rest } = init as RequestInit & { next?: object };
  return fetch(url, {
    ...rest,
    ...(next ? { next } : {}),
    signal: AbortSignal.timeout(5000),
  });
}
