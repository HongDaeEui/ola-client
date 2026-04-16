// React Router
import { Navigate } from 'react-router-dom'

// Layouts & Components
import AdminLayout from '@/layout/AdminLayout'
import LoginLayout from '@/layout/LoginLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages
import LoginPage from '@/pages/login/LoginPage'

// Route Modules
import { exampleRoutes } from './routes/exampleRoutes'
import { userRoutes } from './routes/userRoutes'
import { productRoutes } from './routes/productRoutes'
import { noticeRoutes } from './routes/noticeRoutes'
import { categoryRoutes } from './routes/categoryRoutes'

// Types
import type { RouteWithMeta } from './types'

export const routes: RouteWithMeta[] = [
  // 로그인
  {
    path: '/login',
    element: <LoginLayout />,
    children: [
      {
        path: '',
        element: <LoginPage />,
      }
    ]
  },

  // 관리자 페이지 (인증 필요)
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          // 메인 페이지 (/) - 예제 페이지로 리다이렉트
          {
            element: <Navigate to="/example" replace />
          },

          // 예제 관리
          ...exampleRoutes,

          // 사용자 관리
          ...userRoutes,

          // 상품 관리
          ...productRoutes,

          // 공지사항
          ...noticeRoutes,

          // 카테고리 관리
          ...categoryRoutes,
        ]
      }
    ]
  },

  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]
