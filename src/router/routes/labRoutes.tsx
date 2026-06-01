import { lazy } from 'react';
import type { RouteWithMeta } from '../types';

const LabsListPage = lazy(() => import('@/pages/labs/list/LabsListPage'));

export const labRoutes: RouteWithMeta[] = [
  {
    path: 'labs',
    meta: {
      label: '실험실 관리',
      icon: '🧪',
      showInMenu: true,
    },
    children: [
      {
        path: '',
        element: <LabsListPage />,
        meta: {
          label: '실험실 목록',
        }
      }
    ]
  }
];
