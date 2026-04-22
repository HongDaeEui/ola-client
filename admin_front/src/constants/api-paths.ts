/**
 * API 경로 상수
 * 환경별 API 경로 변경이 필요한 경우 이 파일에서 관리
 */

// Base Prefixes
export const API_PREFIX = {
  AUTH: '/auth',
  TOOLS: '/tools',
  LABS: '/labs',
  PROMPTS: '/prompts',
  POSTS: '/posts',
  USER: '/users',
  CATEGORY: '/categories',
} as const

// Auth API
export const AUTH_API = {
  LOGIN: `${API_PREFIX.AUTH}/sign-in`,
  SELF: `/self`,
} as const

// Tools API
export const TOOLS_API = {
  PREFIX: API_PREFIX.TOOLS,
  ID: (id: number) => `${API_PREFIX.TOOLS}/${id}`,
} as const

// Labs API
export const LABS_API = {
  PREFIX: API_PREFIX.LABS,
  ID: (id: number) => `${API_PREFIX.LABS}/${id}`,
} as const

// Prompts API
export const PROMPTS_API = {
  PREFIX: API_PREFIX.PROMPTS,
  ID: (id: number) => `${API_PREFIX.PROMPTS}/${id}`,
} as const

// Posts API
export const POSTS_API = {
  PREFIX: API_PREFIX.POSTS,
  ID: (id: number) => `${API_PREFIX.POSTS}/${id}`,
} as const

// User API
export const USER_API = {
  PREFIX: API_PREFIX.USER,
  ID: (id: number) => `${API_PREFIX.USER}/${id}`,
} as const

// Category API
export const CATEGORY_API = {
  PREFIX: API_PREFIX.CATEGORY,
  ID: (id: number) => `${API_PREFIX.CATEGORY}/${id}`,
} as const
