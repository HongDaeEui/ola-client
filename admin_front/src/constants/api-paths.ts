/**
 * API 경로 상수
 * 환경별 API 경로 변경이 필요한 경우 이 파일에서 관리
 */

// Base Prefixes
export const API_PREFIX = {
  AUTH: '/auth',
  EXAMPLE: '/examples',
  USER: '/users',
  PRODUCT: '/products',
  NOTICE: '/notices',
  CATEGORY: '/categories',
} as const

// Auth API
export const AUTH_API = {
  LOGIN: `${API_PREFIX.AUTH}/sign-in`,
  SELF: `/self`,
} as const

// Example API
export const EXAMPLE_API = {
  PREFIX: API_PREFIX.EXAMPLE,
  ID: (id: number) => `${API_PREFIX.EXAMPLE}/${id}`,
} as const

// User API
export const USER_API = {
  PREFIX: API_PREFIX.USER,
  ID: (id: number) => `${API_PREFIX.USER}/${id}`,
} as const

// Product API
export const PRODUCT_API = {
  PREFIX: API_PREFIX.PRODUCT,
  ID: (id: number) => `${API_PREFIX.PRODUCT}/${id}`,
} as const

// Notice API
export const NOTICE_API = {
  PREFIX: API_PREFIX.NOTICE,
  ID: (id: number) => `${API_PREFIX.NOTICE}/${id}`,
} as const

// Category API
export const CATEGORY_API = {
  PREFIX: API_PREFIX.CATEGORY,
  ID: (id: number) => `${API_PREFIX.CATEGORY}/${id}`,
} as const
