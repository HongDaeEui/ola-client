import { lazy } from 'react';
import type { RouteWithMeta } from '../types';

const ToolsListPage = lazy(() => import('@/pages/tools/list/ToolsListPage'));

export const toolRoutes: RouteWithMeta[] = [
  {
    path: 'tools',
    meta: {
      label: 'AI 도구 관리',
      icon: '⚙️',
      showInMenu: true,
    },
    children: [
      {
        path: '',
        element: <ToolsListPage />,
        meta: {
          label: '도구 목록',
        }
      }
    ]
  }
];
